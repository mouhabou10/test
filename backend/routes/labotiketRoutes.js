import { Router } from "express";
const labotiketRoutes = Router();

labotiketRoutes.get('/',(req,res)=>
{res.send('Get all accounts')})

labotiketRoutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

labotiketRoutes.post('/',(req,res)=>
{res.send('create new account')})

labotiketRoutes.delete('/',(req,res)=>
    {res.send('Delet all tikets')})
 
export default labotiketRoutes