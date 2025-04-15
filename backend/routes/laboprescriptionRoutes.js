import { Router } from "express";
const laboprescriptionroutes = Router();

laboprescriptionroutes.get('/',(req,res)=>
{res.send('Get all accounts')})

laboprescriptionroutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

laboprescriptionroutes.post('/',(req,res)=>
{res.send('create new prescription')})

export default laboprescriptionroutes