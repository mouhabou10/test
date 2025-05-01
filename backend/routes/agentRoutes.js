import { Router } from "express";
const agentRoutes = Router();

agentRoutes.get('/',(req,res)=>
{res.send('Get all agents')})

agentRoutes.get('/:id',(req,res)=>
    {res.send('Get agent details')})

agentRoutes.post('/',(req,res)=>
{res.send('create new agen worker')})

agentRoutes.put('/:id',(req,res)=>
{res.send('Update agent data')})

agentRoutes.delete('/:id',(req,res)=>
    {res.send('Delet agent')})
 
export default agentRoutes