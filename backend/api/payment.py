from fastapi import APIRouter, HTTPException, Body, Depends
import razorpay
import os
import sqlite3
import time
from .auth import get_current_user

router = APIRouter()

def _db_path() -> str:
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_dir, "vpay.db")

@router.post("/create-order")
async def create_order(
    data: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Creates a Razorpay order and records a pending transaction.
    """
    try:
        amount = data.get("amount")
        currency = data.get("currency", "INR")
        biller = data.get("biller", "Merchant")
        category = data.get("category", "General")
        
        if not amount:
            raise HTTPException(status_code=400, detail="Amount is required")
            
        # Check balance
        if current_user["balance"] < amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")

        # Record pending transaction
        conn = sqlite3.connect(_db_path())
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO transactions (user_id, amount, type, biller, category, status, timestamp) VALUES (?,?,?,?,?,?,?)",
            (current_user["id"], amount, "debit", biller, category, "pending", int(time.time()))
        )
        transaction_id = cur.lastrowid
        conn.commit()
        conn.close()
        
        # MOCK RESPONSE (Simulating Razorpay)
        mock_order = {
            "id": f"order_mock_{transaction_id}",
            "amount": amount * 100,
            "currency": currency,
            "status": "created",
            "transaction_id": transaction_id
        }
        
        return mock_order

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-payment")
async def verify_payment(
    data: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Verifies payment and updates balance.
    """
    try:
        transaction_id = data.get("transaction_id")
        amount = data.get("amount")
        
        if not transaction_id or amount is None:
            raise HTTPException(status_code=400, detail="Transaction ID and amount required")
            
        conn = sqlite3.connect(_db_path())
        cur = conn.cursor()
        
        # 1. Update user balance
        cur.execute("UPDATE users SET balance = balance - ? WHERE id = ?", (amount, current_user["id"]))
        
        # 2. Update transaction status
        cur.execute("UPDATE transactions SET status = 'success' WHERE id = ?", (transaction_id,))
        
        conn.commit()
        conn.close()
        
        return {"status": "success", "message": "Payment verified and balance updated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Payment verification failed: {str(e)}")
