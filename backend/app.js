import express from 'express';
import { PORT, NODE_ENV } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

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
import serviceRoutes from './routes/serviceRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import userRoutes from './routes/user.Routes.js';
import authRoutes from './routes/auth.Routes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import accountDemandRoutes from './routes/accountDemandRoutes.js';
import serviceProviderRouter from './routes/serviceProviderRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import errorMiddleware from './Middlewares/error.Middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('✅ Server is working!');
});

// Routes
app.use('/api/v1/account-demands', accountDemandRoutes);
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
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/workers', workerRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/service-provider', serviceProviderRouter);
app.use('/api/v1/appointments', appointmentRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(errorMiddleware);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err);
  });

export default app;
