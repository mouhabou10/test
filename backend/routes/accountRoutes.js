import { Router } from "express";
const accountRouter = Router();

accountRouter.get('/',(req,res)=>
{res.send('Get all accounts')})

accountRouter.get('/:id',(req,res)=>
    {res.send('Get account details')})

accountRouter.post('/',(req,res)=>
{res.send('create new account')})

accountRouter.put('/:id',(req,res)=>
{res.send('Update account')})

accountRouter.delete('/:id',(req,res)=>
    {res.send('Delet account')})
 
export default accountRouter