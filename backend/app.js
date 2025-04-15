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
const app = express();

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});

export default app;
