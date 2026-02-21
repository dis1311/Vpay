from fastapi import APIRouter, HTTPException, Body, Depends, status
from fastapi.security import OAuth2PasswordBearer
import os
import time
import sqlite3
import jwt
from typing import Dict, Any, Optional
from passlib.context import CryptContext
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def _db_path() -> str:
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_dir, "vpay.db")

def _ensure_db():
    conn = sqlite3.connect(_db_path())
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            name TEXT,
            picture TEXT,
            provider TEXT,
            password_hash TEXT,
            balance REAL DEFAULT 2500.00,
            created_at INTEGER
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            amount REAL,
            type TEXT, -- 'debit' or 'credit'
            biller TEXT,
            category TEXT,
            status TEXT, -- 'success', 'failed', 'pending'
            timestamp INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """
    )
    # Add missing columns for existing users table
    cur.execute("PRAGMA table_info(users)")
    cols = [c[1] for c in cur.fetchall()]
    if "balance" not in cols:
        cur.execute("ALTER TABLE users ADD COLUMN balance REAL DEFAULT 2500.00")
    if "password_hash" not in cols:
        cur.execute("ALTER TABLE users ADD COLUMN password_hash TEXT")
    conn.commit()
    conn.close()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    conn = sqlite3.connect(_db_path())
    cur = conn.cursor()
    cur.execute("SELECT id, email, name, balance FROM users WHERE id=?", (user_id,))
    row = cur.fetchone()
    conn.close()
    
    if row is None:
        raise credentials_exception
    return {"id": row[0], "email": row[1], "name": row[2], "balance": row[3]}

@router.post("/signup")
def signup(data: Dict[str, Any] = Body(...)):
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not name or not email or not password:
        raise HTTPException(status_code=400, detail="Name, email and password required")
    
    _ensure_db()
    conn = sqlite3.connect(_db_path())
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE email=?", (email,))
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=409, detail="Email already exists")
    
    password_hash = pwd_context.hash(password)
    cur.execute(
        "INSERT INTO users (email, name, provider, password_hash, created_at) VALUES (?,?,?,?,?)",
        (email, name, "local", password_hash, int(time.time())),
    )
    user_id = cur.lastrowid
    conn.commit()
    conn.close()
    
    access_token = create_access_token(
        data={"sub": str(user_id)}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"id": user_id, "email": email, "name": name, "balance": 2500.00}
    }

@router.post("/login")
def login(data: Dict[str, Any] = Body(...)):
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    
    _ensure_db()
    conn = sqlite3.connect(_db_path())
    cur = conn.cursor()
    cur.execute("SELECT id, name, password_hash, balance FROM users WHERE email=?", (email,))
    row = cur.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id, name, stored_hash, balance = row
    if not pwd_context.verify(password, stored_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(
        data={"sub": str(user_id)}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"id": user_id, "email": email, "name": name, "balance": balance}
    }

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.get("/transactions")
async def get_transactions(current_user: dict = Depends(get_current_user)):
    conn = sqlite3.connect(_db_path())
    cur = conn.cursor()
    cur.execute(
        "SELECT id, amount, type, biller, category, status, timestamp FROM transactions WHERE user_id=? ORDER BY timestamp DESC",
        (current_user["id"],)
    )
    rows = cur.fetchall()
    conn.close()
    
    transactions = []
    for row in rows:
        transactions.append({
            "id": row[0],
            "amount": row[1],
            "type": row[2],
            "biller": row[3],
            "category": row[4],
            "status": row[5],
            "timestamp": row[6]
        })
    return transactions
