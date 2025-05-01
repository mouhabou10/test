import { Router } from "express";
const laboAgentRoutes = Router();

laboAgentRoutes.get('/',(req,res)=>
{res.send('Get all labo Agents')})

laboAgentRoutes.get('/:id',(req,res)=>
    {res.send('Get labo Agent details')})

laboAgentRoutes.post('/',(req,res)=>
{res.send('create new labo Agent')})

laboAgentRoutes.put('/:id',(req,res)=>
{res.send('Update labo Agent')})

laboAgentRoutes.delete('/:id',(req,res)=>
    {res.send('Delet labo Agent')})
 
export default laboAgentRoutes