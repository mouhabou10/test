from fastapi import APIRouter , Depends
from app.models.user import UserCreate,UserResponse
from app.database import get_database
from fastapi import HTTPException
from app.utils.security import hash_password

router=APIRouter()

@router.post("/register",response_model=UserResponse)
async def register_user(user:UserCreate,db=Depends(get_database)):
    # Get the "pfe" database and "users" collection
    database=db["pfe"]
    user_collection=database["users"]
    
    # Check if the user already exists
    existing_user=await user_collection.find_one({"email":user.email})
    if existing_user:
        raise HTTPException(status_code=400,detail="email already exists")
    
    #prepare user data to insert 
    user_data=user.model_dump()
    user_data["password"]=hash_password(user_data["password"])
    #insert into database 
    result=await user_collection.insert_one(user_data)

    #return the response
    return UserResponse(
        id=str(result.inserted_id),
        username=user.username,
        email=user.email,
        role=user.role
    )   
