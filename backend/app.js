import express from 'express';
import { PORT, NODE_ENV } from './config/env.js'; // assuming you saved it here
import accountRoutes from './routes/accountRoutes.js'
import authRoutes from './routes/auth.Routes.js'
import consultationtiketRoutes from './routes/consultationtiketRoutes.js'
import laboprescriptionRoutes from './routes/laboprescriptionRoutes.js'
import labotiketRoutes from './routes/labotiketRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import radioprescriptionRoutes from './routes/radioticketRoutes.js'
import refferalRoutes from './routes/referralRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import staffRoutes from './routes/staffRoutes.js'
import userRoutes from './routes/user.Routes.js'
import connectToDatabase from './database/mongodb.js'
const app = express();
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/consultation-tickets', consultationtiketRoutes);
app.use('/api/v1/lab-prescriptions', laboprescriptionRoutes);
app.use('/api/v1/lab-tickets', labotiketRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/radio-prescriptions', radioprescriptionRoutes);
app.use('/api/v1/referrals', refferalRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(PORT, async() => {
  console.log(`Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
