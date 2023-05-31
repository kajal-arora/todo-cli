import "express-async-errors";
import express from 'express';

import { signupRouter } from './routes/auth/signup';

let app = express();
// added below middlewares to parse incoming requests.. to read body for post requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
app.use(signupRouter);

export { app };

