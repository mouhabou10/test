import { Router } from "express";
const authRouter = Router();

// Sign-up route
authRouter.post('/sign-up', (req, res) => {
    res.send('sign-up');
});

// Sign-in route
authRouter.post('/sign-in', (req, res) => {
    res.send('sign-in');
});

// Sign-out route
authRouter.post('/sign-out', (req, res) => {
    res.send('sign-out');
});

export default authRouter;
