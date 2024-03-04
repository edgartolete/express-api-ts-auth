import { Signs } from './Utils/constants';
import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { requestRateLimiter } from './Middlewares/rateLimiterMiddleware';
import dotenv from 'dotenv';
import { errorResponse, notFound } from './Middlewares/errorHandlerMiddleware';
import { authRouter } from './Routes/authRoute';
import { appCodeMiddleware } from './Middlewares/appCodeMiddleware';
import { usersRouter } from './Routes/usersRoute';
import { groupsRouter } from './Routes/groupsRoute';
import { rolesRouter } from './Routes/rolesRoute';
import { sysAdminRouter } from './Routes/sysAdminRoute';
import { appsRouter } from './Routes/appsRoute';
import { sysAdminTokenMiddleware } from './Middlewares/tokenMiddleware';
import { startConnections } from './Connections/startConnections';
import { secure } from './Utils/secure';
import { Log } from './Connections/mongoDB';

dotenv.config();

startConnections();

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

app.use(Log.start);

// app.use(apiKeyMiddleware); //only allow request with API Key to make requests.

app.use(requestRateLimiter); //limit the number of request per IP Address.

app.use(express.json());

// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'request.log'), { flags: 'a' });
// app.use(
// 	morgan(
// 		'DATE: :date, ADDRESS: :remote-addr, USER: :remote-user, METHOD: :method, URL: :url, HTTP VERSION: :http-version, STATUS: :status, RES CONTENT-LENGTH: :res[content-length], USER AGENT: :user-agent, RATE LIMIT: :res[RateLimit], RESPONSE TIME: :response-time ms, TOTAL TIME: :total-time ms',
// 		{
// 			stream: accessLogStream,
// 			skip: function (req, res) {
// 				return res.statusCode < 400;
// 			}
// 		}
// 	)
// );

/*##### ROUTES #####*/

// app.use('/apps', sysAdminTokenMiddleware, appsRouter);
app.use('/apps', appsRouter);
app.use('/:app/auth', authRouter);
app.use('/:app/users', appCodeMiddleware, usersRouter);
app.use('/:app/groups', groupsRouter);
app.use('/:app/roles', rolesRouter);
app.use('/:app/*', appCodeMiddleware, notFound);

/**#### HANDLING ERRORS ##### */
app.use(errorResponse); // should be used after other middleware and routes

app.get('/', (req, res) => {
	res.json({ message: 'API is working' });
});
app.use('/', sysAdminRouter);

app.all('*', notFound);

export default app;
