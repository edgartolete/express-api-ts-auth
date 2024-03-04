import mongoose from 'mongoose';
import { fakeDelay, tryCatchAsync } from '../Utils/helpers';
import { Signs } from '../Utils/constants';
import { EventEmitter } from 'node:events';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export async function initializeMongoDB() {
	const mongoConnString = process.env.MONGO_DB_CONN || '';
	const [_, err] = await tryCatchAsync(() => mongoose.connect(mongoConnString));

	if (err !== null) {
		console.log(`${Signs.error} MongoDB Connection Error: ${err.message}`);
	}

	if (mongoose.connection.readyState === 1) {
		console.log(`${Signs.okay} Connected to MongoDB.`);
	} else {
		console.log(
			`${Signs.error} Mongo Connection State: ${getMongoDBConnectionState(mongoose.connection.readyState)}`
		);
	}
}

function getMongoDBConnectionState(code: number) {
	switch (code) {
		case 0: {
			return `${code}: Disconnected`;
		}
		case 1: {
			return `${code}: Connected`;
		}
		case 2: {
			return `${code}: Connecting`;
		}
		case 3: {
			return `${code}: Disconnecting`;
		}
		case 99: {
			return `${code}: Uninitialized`;
		}
		default: {
			return `${code}: Unknown code`;
		}
	}
}

/**
 * TODO: Create a logs using mongo DB, each log Category has separate tables
 *  ErrorLogs - Log all critical errors.
 *  UserLogs - Log activities of a user
 *  SystemLogs - Log anything not under error and user.
 */

type ErrorLogType = {
	source: string;
	error: Error;
};

const errorLogsSchema = new mongoose.Schema({
	source: String,
	name: String,
	message: String,
	stack: String,
	date: Date
});

const ErrorLogsModel = mongoose.model('ErrorLogs', errorLogsSchema);

const userLogSchema = new mongoose.Schema({
	userId: Number,
	entityId: Number,
	recordId: Number,
	action: String,
	date: Date
});

const UserLogModel = mongoose.model('UserLogs', userLogSchema);

type UserLogType = {
	userId: number;
	entityId: number;
	recordId: number;
	action: 'create' | 'read' | 'update' | 'delete';
	date?: Date;
};

const requestLogSchema = new mongoose.Schema({
	ip: String,
	method: String,
	statusCode: String,
	hostname: String,
	originalUrl: String,
	httpVersion: String,
	contentLength: String,
	rateLimit: String,
	responseTimeMS: Number,
	date: Date
});

const RequestLogModel = mongoose.model('RequestLog', requestLogSchema);

type RequestResponseType = {
	req: Request;
	res: Response;
};

export const Log = {
	startTime: 0,
	ee: new EventEmitter(),
	start: (req: Request, res: Response, next: NextFunction) => {
		Log.startTime = performance.now();
		next();
	},
	error: ({ source, error }: ErrorLogType) => {
		new ErrorLogsModel({
			source,
			name: error.name,
			message: error.message,
			stack: error.stack,
			date: new Date()
		}).save();
	},
	user: (userLog: UserLogType) => {
		userLog.date = new Date();
		new UserLogModel(userLog).save();
	},
	request: (req: Request, res: Response) => {
		Log.ee.on('afterResponseEvent', ({ req, res }: RequestResponseType) => {
			const endTime = performance.now();
			const { ip, method, hostname, httpVersion, originalUrl } = req;

			const rateLimit = res.getHeader('RateLimit');
			const contentLength = res.getHeader('content-length');

			new RequestLogModel({
				ip,
				method,
				statusCode: res.statusCode,
				hostname,
				originalUrl,
				httpVersion,
				contentLength,
				rateLimit,
				responseTimeMs: endTime - Log.startTime,
				date: Date.now()
			}).save();
		});

		Log.ee.emit('afterResponseEvent', { req, res });
	}
};
