# OptiChain Backend API

Backend API for OptiChain WS & DWS system built with FastAPI and PostgreSQL.

## Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy
- **Authentication**: JWT
- **Migration**: Alembic

## Project Structure

```
backend/
├── app/
│   ├── api/          # API endpoints
│   ├── core/         # Core config, security, database
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic
│   └── main.py       # FastAPI app entry point
├── tests/            # Test files
├── alembic/          # Database migrations
└── requirements.txt  # Python dependencies
```

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT tokens

### 4. Database Setup

```bash
# Create database
createdb optichain_db

# Run migrations
alembic upgrade head

# Or manually run schema
psql -U username -d optichain_db -f ../database/schema.sql
```

## Running the Server

### Development

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

```bash
pytest
```

## Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## API Endpoints (Planned)

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `GET /api/v1/auth/me` - Get current user

### Tasks
- `GET /api/v1/tasks` - List tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/{id}` - Get task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task

### Staff
- `GET /api/v1/staff` - List staff
- `POST /api/v1/staff` - Create staff
- `GET /api/v1/staff/{id}` - Get staff details

### Stores
- `GET /api/v1/stores` - List stores
- `POST /api/v1/stores` - Create store

### Shifts
- `GET /api/v1/shifts` - List shifts
- `POST /api/v1/shifts/assignments` - Assign shifts

## License

Proprietary - Aoi Sora Project
