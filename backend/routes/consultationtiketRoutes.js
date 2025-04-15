import { Router } from "express";
const consultationtiketRoutes = Router();

consultationtiketRoutes.get('/',(req,res)=>
{res.send('Get all accounts')})

consultationtiketRoutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

consultationtiketRoutes.post('/',(req,res)=>
{res.send('create new account')})

consultationtiketRoutes.delete('/:id',(req,res)=>
    {res.send('Delet account')})
 
export default consultationtiketRoutes