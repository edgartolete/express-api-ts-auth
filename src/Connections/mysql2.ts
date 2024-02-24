import { createPool } from 'mysql2';
import { Signs } from '../Utils/constants';

/**
 * connect to the database and create a pool for connection limit to improve performance
 */
const pool = createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10, // Adjust as needed
	queueLimit: 0, //zero for no limit
	idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
	enableKeepAlive: true,
	keepAliveInitialDelay: 0
});

/**
 * check if connection to the database is established
 */

export function initializeMySQL() {
	pool.getConnection((err, connection) => {
		if (err) {
			console.error(`${Signs.error} Error connecting to MySQL database`);
			console.error(err);
		} else {
			console.log(`${Signs.okay} Connected to MySQL database`);
			connection.release();
		}
	});
}

export function stopMySQL() {
	pool.end();
}
/**
 * create a promisePool to be used by Model. Allows model to use a promised response to be used by controllers
 */
const promisePool = pool.promise();

export { promisePool };
