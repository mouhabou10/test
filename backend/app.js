import express from 'express';
import { PORT, NODE_ENV } from './config/env.js';
import connectToDatabase from './database/mongodb.js';

import agentRoutes from './routes/agentRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import consultationAgentRoutes from './routes/consultationAgentRoutes.js';
import departmentChefRoutes from './routes/departmentChefRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import laboAgentRoutes from './routes/laboAgentRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import radioAgentRoutes from './routes/radioAgentRoutes.js';
import referralLetterRoutes from './routes/referralLetterRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import specialityRoutes from './routes/specialityRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import workerRoutes from './routes/workerRoutes.js';


 import userRoutes from './routes/userRoutes.js';
 import authRoutes from './routes/auth.Routes.js';
 import notificationRoutes from './routes/notificationRoutes.js';
 import serviceRoutes from './routes/serviceRoutes.js';
import errorMiddleware from './Middlewares/error.Middleware.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json()); // Important to parse incoming JSON
app.use(express.urlencoded({extended: false}));
app.use(cookieParser)
// Routes setup
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/consultation-agents', consultationAgentRoutes);
app.use('/api/v1/department-chefs', departmentChefRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/labo-agents', laboAgentRoutes);
app.use('/api/v1/managers', managerRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/radio-agents', radioAgentRoutes);
app.use('/api/v1/referral-letters', referralLetterRoutes);
app.use('/api/v1/results', resultRoutes);
app.use('/api/v1/specialities', specialityRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/workers', workerRoutes);


 app.use('/api/v1/users', userRoutes);
 app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notifications', notificationRoutes);
 app.use('/api/v1/services', serviceRoutes);
 app.use(errorMiddleware)

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`✅ Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});

export default app;
