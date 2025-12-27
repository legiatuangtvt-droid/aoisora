from sqlalchemy import Column, DateTime, func
from ..core.database import Base


class TimestampMixin:
    """Mixin for created_at and updated_at columns"""
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
