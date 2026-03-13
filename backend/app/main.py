from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database import connect_to_mongo, close_mongo_connection
from app.routes.user import router as user_router

@asynccontextmanager
async def lifespan(app):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(lifespan=lifespan)

app.include_router(user_router,prefix="/users",tags=["Users"])

@app.get("/")
async def read_root():
    return {"message": "Hello World. FastAPI is running!"}
