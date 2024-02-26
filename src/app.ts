import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { requestRateLimiter } from './Middlewares/rateLimiterMiddleware';
import dotenv from 'dotenv';
import { errorResponse, notFound } from './Middlewares/errorHandlerMiddleware';
import { apiKeyMiddleware } from './Middlewares/apiKeyMiddleware';
import { tokenRouter } from './Routes/tokenRoute';

dotenv.config();

const app: Express = express();

/*##### MIDDLEWARES #####*/
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
};

app.use(cors(corsOptions)); //use cors middleware first always on app.use

app.use(bodyParser.json()); // Use body-parser middleware

app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet()); //adds another layer of security

app.use(apiKeyMiddleware); //only allow request with API Key to make requests.

app.use(requestRateLimiter); //limit the number of request per IP Address.

app.use(express.json());

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'request.log'), { flags: 'a' });
app.use(
	morgan(
		'DATE: :date, ADDRESS: :remote-addr, USER: :remote-user, METHOD: :method, URL: :url, HTTP VERSION: :http-version, STATUS: :status, RES CONTENT-LENGTH: :res[content-length], USER AGENT: :user-agent, RATE LIMIT: :res[RateLimit], RESPONSE TIME: :response-time ms, TOTAL TIME: :total-time ms',
		{
			stream: accessLogStream
		}
	)
);

/*##### ROUTES #####*/

app.use('/token', tokenRouter);

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'API is working' });
});

/**#### HANDLING ERRORS ##### */
app.all('*', notFound);
app.use(errorResponse); // should be used after other middleware and routes

export default app;
