import { Router } from "express";
const radioAgentRoutes = Router();

radioAgentRoutes.get('/',(req,res)=>
{res.send('Get all radio Agents')})

radioAgentRoutes.get('/:id',(req,res)=>
    {res.send('Get radio Agent details')})

radioAgentRoutes.post('/',(req,res)=>
{res.send('create new radio Agent')})

radioAgentRoutes.put('/:id',(req,res)=>
{res.send('Update radio Agent')})

radioAgentRoutes.delete('/:id',(req,res)=>
    {res.send('Delet radio Agent')})
 
export default radioAgentRoutes