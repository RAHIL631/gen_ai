from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class RoleEnum(str, Enum):
    USER = "user"
    ADMIN = "admin"

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[RoleEnum] = None

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    hashed_password: str
    role: RoleEnum = RoleEnum.USER
    is_active: bool = True

class UserResponse(UserBase):
    role: RoleEnum
    is_active: bool
