import { Router } from "express";
const userRouter = Router();

userRouter.get('/',(req,res)=>
{res.send('Get all users')})

userRouter.get('/:id',(req,res)=>
    {res.send('Get user details')})

userRouter.post('/',(req,res)=>
{res.send('create new user')})

userRouter.put('/:id',(req,res)=>
{res.send('Update user')})

userRouter.delete('/:id',(req,res)=>
    {res.send('Delet users')})
 
export default userRouter