import { Router } from "express";
const notificationRoutes = Router();

notificationRoutes.get('/',(req,res)=>
{res.send('Get all accounts')})

notificationRoutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

notificationRoutes.post('/',(req,res)=>
{res.send('create new account')})
export default notificationRoutes