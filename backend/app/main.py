import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.utils.response_wrapper import error_response
import app.models

logger = logging.getLogger("medisense.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="MediSense AI — Clinical Decision Support API",
    description=(
        "**MediSense AI Backend REST API**\n\n"
        "Provides clinical decision support workflows including:\n"
        "- **Authentication & RBAC**: JWT Bearer auth for Patients and Clinicians\n"
        "- **Patient Management**: Demographic records and medical history\n"
        "- **Symptom Assessment & AI Support**: Multi-symptom triage with explainable AI support data\n"
        "- **Health Tracking & Vitals**: Biometric time-series data and BMI calculation\n"
        "- **Doctor Clinical Review**: Patient triage queue and AI recommendation decision review (accept/override)\n\n"
        "*Disclaimer: AI outputs are provided strictly as clinical decision support aids and do not constitute a formal diagnosis.*"
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    code_map = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        409: "CONFLICT",
        422: "UNPROCESSABLE_ENTITY",
        500: "INTERNAL_SERVER_ERROR"
    }
    code = code_map.get(exc.status_code, "HTTP_ERROR")
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(
            code=code,
            message=str(exc.detail),
            detail=exc.detail
        ),
        headers=getattr(exc, "headers", None)
    )


@app.exception_handler(StarletteHTTPException)
async def starlette_http_exception_handler(request: Request, exc: StarletteHTTPException):
    code_map = {
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        405: "METHOD_NOT_ALLOWED",
        500: "INTERNAL_SERVER_ERROR"
    }
    code = code_map.get(exc.status_code, "HTTP_ERROR")
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(
            code=code,
            message=str(exc.detail),
            detail=exc.detail
        )
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    simplified_errors = []
    for err in errors:
        loc = " -> ".join([str(l) for l in err.get("loc", [])])
        msg = err.get("msg", "Invalid value")
        simplified_errors.append(f"{loc}: {msg}")

    detail_message = "; ".join(simplified_errors)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_response(
            code="VALIDATION_ERROR",
            message=detail_message or "Request validation failed",
            detail=errors
        )
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled server error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response(
            code="INTERNAL_SERVER_ERROR",
            message="An internal server error occurred. Please try again later.",
            detail=str(exc)
        )
    )


# Register Feature Routers
from app.routes.auth_routes import router as auth_router
from app.routes.patient_routes import router as patient_router
from app.routes.symptom_routes import router as symptom_router
from app.routes.health_record_routes import router as health_record_router
from app.routes.doctor_routes import router as doctor_router

app.include_router(auth_router)
app.include_router(patient_router)
app.include_router(symptom_router)
app.include_router(health_record_router)
app.include_router(doctor_router)


from app.utils.response_wrapper import APIResponse
from pydantic import BaseModel


class RootStatusData(BaseModel):
    name: str
    version: str
    docs: str
    redoc: str
    openapi: str
    status: str


class RootResponse(APIResponse[RootStatusData]):
    pass


@app.get(
    "/",
    response_model=RootResponse,
    tags=["Root / Health Check"],
    summary="API Health and System Status",
    description="Returns the current operational status, version, and links to interactive OpenAPI documentation."
)
def root():
    return {
        "success": True,
        "data": {
            "name": settings.PROJECT_NAME,
            "version": "1.0.0",
            "docs": "/docs",
            "redoc": "/redoc",
            "openapi": "/openapi.json",
            "status": "healthy"
        },
        "message": "MediSense AI Clinical Support API is online and operational",
        "error": None
    }
