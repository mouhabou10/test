import { Router } from "express";
const managerRoutes = Router();

managerRoutes.get('/',(req,res)=>
{res.send('Get all managers')})

managerRoutes.get('/:id',(req,res)=>
    {res.send('Get manager details')})

managerRoutes.post('/',(req,res)=>
{res.send('create new manager')})

managerRoutes.put('/:id',(req,res)=>
{res.send('Update manager')})

managerRoutes.delete('/:id',(req,res)=>
    {res.send('Delet manager')})
 
export default managerRoutes