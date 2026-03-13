from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum


class UserRole(str,Enum):
    client="client"
    worker="worker"
    service_provider="service_provider"
    admin="admin"

class UserCreate(BaseModel):
    username:str
    email:EmailStr
    password:str
    role:UserRole

class UserResponse(BaseModel):
    id:str
    username:str
    email:EmailStr
    role:UserRole    