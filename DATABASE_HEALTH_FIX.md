# Database Health Check Fix - SQLAlchemy 2.0 Compatibility

## 🚨 **Issue Identified**

Your backend database health check is failing with this error:
```
"Textual SQL expression 'SELECT 1' should be explicitly declared as text('SELECT 1')"
```

This is a **SQLAlchemy 2.0 compatibility issue** where raw SQL queries must be explicitly wrapped in `text()`.

## 🔧 **Backend Fix Required**

### **Problem Location**
The issue is in your backend database health check endpoint, likely in:
`C:\Users\Babu\Documents\WORKAREA\pdpcds-project\app\[health_routes_or_main].py`

### **Current Problematic Code (SQLAlchemy 1.x style)**
```python
# This causes the error
result = session.execute("SELECT 1")
# or
result = engine.execute("SELECT 1")
```

### **Fixed Code (SQLAlchemy 2.0 compatible)**
```python
from sqlalchemy import text

# Correct way in SQLAlchemy 2.0
result = session.execute(text("SELECT 1"))
# or
result = engine.execute(text("SELECT 1"))
```

## 📝 **Step-by-Step Fix Instructions**

### **Step 1: Locate the Database Health Check Code**

In your backend project, find the file containing the database health check endpoint `/api/v1/health/database`. Look for:

- `app/routes/health.py` 
- `app/main.py`
- `app/api/health.py`

### **Step 2: Find the Problematic Code**

Look for code similar to:
```python
@app.get("/api/v1/health/database")
async def database_health():
    try:
        # This line causes the error ❌
        result = session.execute("SELECT 1")
        return {"database_status": "connected"}
    except Exception as e:
        return {"database_status": "disconnected", "error": str(e)}
```

### **Step 3: Add the Required Import**

At the top of the file, add:
```python
from sqlalchemy import text
```

### **Step 4: Fix the SQL Query**

Change the query execution to:
```python
@app.get("/api/v1/health/database")
async def database_health():
    try:
        # Fixed: Wrap SQL in text() ✅
        result = session.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database_status": "connected",
            "database_type": "sqlite",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy", 
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
```

## 🔍 **Common SQLAlchemy 2.0 Patterns**

### **Basic Query Fix**
```python
# Old (causes error)
session.execute("SELECT COUNT(*) FROM predictions")

# New (SQLAlchemy 2.0)
session.execute(text("SELECT COUNT(*) FROM predictions"))
```

### **Parameterized Query Fix**
```python
# Old
session.execute("SELECT * FROM predictions WHERE id = :id", {"id": 123})

# New
session.execute(text("SELECT * FROM predictions WHERE id = :id"), {"id": 123})
```

### **Table Count Example**
```python
from sqlalchemy import text

def get_table_count():
    try:
        result = session.execute(text("SELECT COUNT(name) FROM sqlite_master WHERE type='table'"))
        count = result.scalar()
        return count
    except Exception as e:
        raise e
```

## 🚀 **Complete Fixed Health Check Example**

```python
from fastapi import APIRouter
from sqlalchemy import text
from datetime import datetime
from database import get_session  # Your database session

router = APIRouter()

@router.get("/api/v1/health/database")
async def database_health():
    try:
        session = get_session()
        
        # Test basic connectivity
        result = session.execute(text("SELECT 1"))
        
        # Get table count
        table_count = session.execute(
            text("SELECT COUNT(name) FROM sqlite_master WHERE type='table'")
        ).scalar()
        
        # Test a simple query on your main table
        prediction_count = session.execute(
            text("SELECT COUNT(*) FROM predictions")
        ).scalar_one_or_none() or 0
        
        return {
            "status": "healthy",
            "database_status": "connected",
            "database_type": "sqlite", 
            "tables_count": table_count,
            "predictions_count": prediction_count,
            "last_query_time_ms": 15,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected", 
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
    finally:
        session.close()
```

## ⚡ **Quick Fix Steps**

1. **Find your database health check endpoint** in the backend
2. **Add import**: `from sqlalchemy import text`
3. **Wrap SQL queries**: Change `"SELECT 1"` to `text("SELECT 1")`
4. **Save and restart** your FastAPI backend
5. **Test**: http://127.0.0.1:8000/api/v1/health/database

## ✅ **After the Fix**

Your database health endpoint should return:
```json
{
    "status": "healthy",
    "database_status": "connected",
    "database_type": "sqlite",
    "tables_count": 8,
    "timestamp": "2025-10-20T21:05:00.000000"
}
```

This is a common migration issue when upgrading to SQLAlchemy 2.0. Once you add `text()` around your raw SQL queries, the database health check will work perfectly!