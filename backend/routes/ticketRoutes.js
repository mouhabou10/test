import { Router } from "express";
const tiketRoutes = Router();

tiketRoutes.get('/',(req,res)=>
{res.send('Get all accounts')})

tiketRoutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

tiketRoutes.post('/',(req,res)=>
{res.send('create new account')})

tiketRoutes.delete('/',(req,res)=>
    {res.send('Delet account')})
 
export default tiketRoutes