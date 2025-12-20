"""
Authentication endpoints for ARC Privus AI Madre
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from typing import Dict
import logging

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_token
)

logger = logging.getLogger(__name__)
router = APIRouter()


class UserRegister(BaseModel):
    """User registration request model"""
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    """User login request model"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str


@router.post("/register", response_model=Dict, status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    """
    Register a new user
    
    Args:
        user: User registration data
        
    Returns:
        Success message
        
    Note:
        In production, this should check for existing users and store in database
    """
    logger.info(f"User registration attempt: {user.email}")
    
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # TODO: Store user in database
    # For now, just return success
    
    return {
        "message": "User registered successfully",
        "email": user.email
    }


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Login user and return access token
    
    Args:
        credentials: User login credentials
        
    Returns:
        Access token
        
    Note:
        In production, this should verify against database
    """
    logger.info(f"Login attempt: {credentials.email}")
    
    # TODO: Verify credentials against database
    # For now, create token for demonstration
    
    access_token = create_access_token(
        data={"sub": credentials.email, "type": "access"}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/verify")
async def verify_user_token(payload: dict = Depends(verify_token)):
    """
    Verify the current user's token
    
    Args:
        payload: Token payload from verify_token dependency
        
    Returns:
        Token verification status
    """
    return {
        "status": "valid",
        "user": payload.get("sub"),
        "token_type": payload.get("type")
    }
