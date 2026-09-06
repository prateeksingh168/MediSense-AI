# MediSense AI — Backend

Backend REST API for MediSense AI, built with FastAPI, SQLAlchemy, Pydantic, and JWT authentication.

## Setup & Running

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment configuration**:
   Copy `.env.example` to `.env` (or let it fallback to default SQLite):
   ```bash
   cp .env.example .env
   ```

3. **Run the development server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

4. **API Documentation (Swagger UI)**:
   Navigate to [http://localhost:8000/docs](http://localhost:8000/docs).

5. **Run Tests**:
   ```bash
   pytest
   ```
