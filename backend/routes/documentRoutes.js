import { Router } from "express";
const documentRoutes = Router();

documentRoutes.get('/',(req,res)=>
{res.send('Get all documents')})

documentRoutes.get('/:id',(req,res)=>
    {res.send('Get document details')})

documentRoutes.post('/',(req,res)=>
{res.send('create new document')})

documentRoutes.put('/:id',(req,res)=>
{res.send('Update document')})

documentRoutes.delete('/:id',(req,res)=>
    {res.send('Delet document')})
 
export default documentRoutes