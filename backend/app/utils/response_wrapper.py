from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class ErrorDetail(BaseModel):
    code: str
    detail: Any


class APIResponse(BaseModel, Generic[DataT]):
    success: bool = True
    data: Optional[DataT] = None
    message: str = "Operation successful"
    error: Optional[ErrorDetail] = None


def success_response(data: Any = None, message: str = "Success") -> dict:
    return {
        "success": True,
        "data": data,
        "message": message,
        "error": None
    }


def error_response(code: str, message: str, detail: Any = None) -> dict:
    return {
        "success": False,
        "data": None,
        "message": message,
        "error": {
            "code": code,
            "detail": detail if detail is not None else message
        }
    }
