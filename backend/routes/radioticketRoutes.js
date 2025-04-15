import { Router } from "express";
const radiotiketRoutes = Router();

radiotiketRoutes.get('/',(req,res)=>
{res.send('Get all accounts')})

radiotiketRoutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

radiotiketRoutes.post('/',(req,res)=>
{res.send('create new account')})

radiotiketRoutes.delete('/:',(req,res)=>
    {res.send('Delet account')})
 
export default radiotiketRoutes