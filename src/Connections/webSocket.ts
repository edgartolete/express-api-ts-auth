const io = require('socket.io')(3001, {
	cors: {
		origin: 'http://localhost:5500',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
	}
});

export const initializeWebSocket = () => {
	io.on('connection', (socket: any) => {
		console.log('a user connected! ID: ' + socket.id);

		socket.on('send-message', (message: any) => {
			console.log('message: ', message);

			io.emit('receive-message', message);
		});
	});
};
