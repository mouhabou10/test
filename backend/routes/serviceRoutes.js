import { Router } from "express";
const serviceRoutes = Router();

serviceRoutes.get('/',(req,res)=>
{res.send('Get all accounts')})

serviceRoutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

serviceRoutes.post('/',(req,res)=>
{res.send('create new account')})

serviceRoutes.put('/:id',(req,res)=>
{res.send('Update account')})

serviceRoutes.delete('/:id',(req,res)=>
    {res.send('Delet account')})
 
export default serviceRoutes