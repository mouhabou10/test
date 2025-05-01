import { Router } from "express";
const departementChefRoutes = Router();

departementChefRoutes.get('/',(req,res)=>
{res.send('Get all departement Chefs')})

departementChefRoutes.get('/:id',(req,res)=>
    {res.send('Get departement Chef details')})

departementChefRoutes.post('/',(req,res)=>
{res.send('create new departement Chef')})

departementChefRoutes.put('/:id',(req,res)=>
{res.send('Update departement Chef')})

departementChefRoutes.delete('/:id',(req,res)=>
    {res.send('Delet departement Chef')})
 
export default departementChefRoutes