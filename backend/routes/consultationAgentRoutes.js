import { Router } from "express";
const consultationagentRoutes = Router();

consultationagentRoutes.get('/',(req,res)=>
{res.send('Get all consultation agents')})

consultationagentRoutes.get('/:id',(req,res)=>
    {res.send('Get consultation agent details')})

consultationagentRoutes.post('/',(req,res)=>
{res.send('create new consultation agent')})

consultationagentRoutes.put('/:id',(req,res)=>
{res.send('Update consultation agent')})

consultationagentRoutes.delete('/:id',(req,res)=>
    {res.send('Delet consultation agent')})
 
export default consultationagentRoutes