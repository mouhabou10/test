import { Router } from "express";
const resultRoutes = Router();

resultRoutes.get('/',(req,res)=>
{res.send('Get all results')})

resultRoutes.get('/:id',(req,res)=>
    {res.send('Get result details')})

resultRoutes.post('/',(req,res)=>
{res.send('create new result')})

resultRoutes.put('/:id',(req,res)=>
{res.send('Update result')})

resultRoutes.delete('/:id',(req,res)=>
    {res.send('Delet result')})
 
export default resultRoutes