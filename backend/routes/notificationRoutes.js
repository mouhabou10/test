import { Router } from "express";
const notificationRoutes = Router();

notificationRoutes.get('/',(req,res)=>
{res.send('Get all accounts')})

notificationRoutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

notificationRoutes.post('/',(req,res)=>
{res.send('create new account')})

notificationRoutes.put('/:id',(req,res)=>
{res.send('Update account')})

notificationRoutes.delete('/:id',(req,res)=>
    {res.send('Delet account')})
 
export default notificationRoutes