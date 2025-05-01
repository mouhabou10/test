import { Router } from "express";
const staffRoutes = Router();

staffRoutes.get('/',(req,res)=>
{res.send('Get all workers')})

staffRoutes.get('/:id',(req,res)=>
    {res.send('Get worker details')})

staffRoutes.post('/',(req,res)=>
{res.send('create new worker')})

staffRoutes.put('/:id',(req,res)=>
{res.send('Update worker')})

staffRoutes.delete('/:id',(req,res)=>
    {res.send('Delet worker')})
 
export default staffRoutes