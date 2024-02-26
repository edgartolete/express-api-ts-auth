import app from './app';
import { startConnections } from './Connections/startConnections';
import { Signs } from './Utils/constants';

console.log('ENVIRONMENT:', process.env.NODE_ENV);

const PORT = process.env.PORT || 9001;

app.listen(PORT, () => {
	console.log(`${Signs.okay} Server running in port: ${PORT}`);
});

startConnections();
