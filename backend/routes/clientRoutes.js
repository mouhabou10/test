import { Router } from "express";
const clientRoutes = Router();

clientRoutes.get('/',(req,res)=>
{res.send('Get all clients')})

clientRoutes.get('/:id',(req,res)=>
    {res.send('Get client details')})

clientRoutes.post('/',(req,res)=>
{res.send('create new client')})

clientRoutes.put('/:id',(req,res)=>
{res.send('Update client')})

clientRoutes.delete('/:id',(req,res)=>
    {res.send('Delet client')})
 
export default clientRoutes