import { Router } from "express";
const labotiketRoutes = Router();

labotiketRoutes.get('/',(req,res)=>
{res.send('Get all accounts')})

labotiketRoutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

labotiketRoutes.post('/',(req,res)=>
{res.send('create new account')})

labotiketRoutes.delete('/:id',(req,res)=>
    {res.send('Delet account')})
 
export default labotiketRoutes