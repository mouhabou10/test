import { Router } from "express";
const radioprescriptionroutes = Router();

radioprescriptionroutes.get('/',(req,res)=>
{res.send('Get all accounts')})

radioprescriptionroutes.get('/:id',(req,res)=>
    {res.send('Get account details')})

radioprescriptionroutes.post('/',(req,res)=>
{res.send('create new prescription')})

export default radioprescriptionroutes