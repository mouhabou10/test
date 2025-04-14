import express from 'express';
import { PORT, NODE_ENV } from './config/env.js'; // assuming you saved it here

const app = express();

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});

export default app;
