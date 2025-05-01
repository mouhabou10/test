import { Router } from "express";
const referralRoutes = Router();

referralRoutes.get('/',(req,res)=>
{res.send('Get all accounts')})

referralRoutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

referralRoutes.post('/',(req,res)=>
{res.send('create new prescription')})

export default referralRoutes