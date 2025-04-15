import { Router } from "express";
const staffRoutes = Router();

staffRoutes.get('/',(req,res)=>
{res.send('Get all accounts')})

staffRoutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

staffRoutes.post('/',(req,res)=>
{res.send('create new account')})

staffRoutes.put('/:id',(req,res)=>
{res.send('Update account')})

staffRoutes.delete('/:id',(req,res)=>
    {res.send('Delet account')})
 
export default staffRoutes