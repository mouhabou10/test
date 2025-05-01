import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller";
const authRouter = Router();

// Sign-up route
authRouter.post('/sign-up', signUp);

// Sign-in route
authRouter.post('/sign-in', signIn);

// Sign-out route
authRouter.post('/sign-out', signOut);

export default authRouter;
