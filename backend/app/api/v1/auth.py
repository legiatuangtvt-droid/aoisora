from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from ...core.database import get_db
from ...core.config import settings
from ...core.security import (
    verify_password, get_password_hash, create_access_token, get_current_user
)
from ...models import Staff
from ...schemas import LoginRequest, TokenResponse, StaffResponse, PasswordChange

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with email and password.
    Returns JWT access token.
    """
    # Find staff by email
    staff = db.query(Staff).filter(Staff.email == login_data.email).first()

    if not staff:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not staff.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Password not set for this account",
        )

    if not verify_password(login_data.password, staff.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not staff.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated",
        )

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": staff.staff_id},
        expires_delta=access_token_expires
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        staff=StaffResponse.model_validate(staff)
    )


@router.get("/me", response_model=StaffResponse)
async def get_current_user_info(current_user: Staff = Depends(get_current_user)):
    """
    Get current logged in user info.
    """
    return StaffResponse.model_validate(current_user)


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change password for current user.
    """
    # Verify current password
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    # Update password
    current_user.password_hash = get_password_hash(password_data.new_password)
    db.commit()

    return {"message": "Password changed successfully"}


@router.post("/logout")
async def logout(current_user: Staff = Depends(get_current_user)):
    """
    Logout current user.
    Note: JWT tokens are stateless, so we just return success.
    In production, you might want to blacklist the token.
    """
    return {"message": "Logged out successfully"}
