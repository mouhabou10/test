import { Router } from "express";
const serviceProviderRoutes = Router();

serviceProviderRoutes.get('/',(req,res)=>
{res.send('Get all service Providers')})

serviceProviderRoutes.get('/:id',(req,res)=>
    {res.send('Get service Provider details')})

serviceProviderRoutes.post('/',(req,res)=>
{res.send('create new service Provider')})

serviceProviderRoutes.put('/:id',(req,res)=>
{res.send('Update service Provider')})

serviceProviderRoutes.delete('/:id',(req,res)=>
    {res.send('Delet service Provider')})
 
export default serviceProviderRoutes