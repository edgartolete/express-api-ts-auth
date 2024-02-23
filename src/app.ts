import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Signs } from './Utils/constants';
import dotenv from 'dotenv';
import { initializeRedis } from './Connections/redis';
import { initializeTypeORM } from './Connections/typeorm';
import { startConnections } from './Connections/startConnections';
import { rateLimiter } from './Middlewares/rateLimit';
dotenv.config();

const app: Express = express();

const PORT = 9000;

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
};

app.use(cors(corsOptions)); //use cors middleware first always on app.use

app.use(bodyParser.json()); // Use body-parser middleware

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use(rateLimiter);

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'API is working' });
});

app.listen(PORT, () => {
	console.log(`${Signs.okay} Server running in port: ${PORT}`);
});

startConnections();
