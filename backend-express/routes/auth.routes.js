import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";
const authRouter = Router();

// Sign-up route
authRouter.post('/signup', signUp);

// Sign-in route
authRouter.post('/signin', signIn);

// Sign-out route
authRouter.post('/signout', signOut);

export default authRouter;
