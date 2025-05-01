import { config } from 'dotenv';

config({
  path: `.env.${process.env.NODE_ENV || 'development'}.local`
});

export const { PORT ,NODE_ENV, JWT_SECRET,Jwt_EXPIRES_IN,DB_URI} = process.env;
