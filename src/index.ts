import app from './app';
import { startConnections } from './Connections/startConnections';
import { Signs } from './Utils/constants';
import { keyGenerator } from './Utils/helpers';

console.log('ENVIRONMENT:', process.env.NODE_ENV);

console.log('key: ', keyGenerator());
const PORT = process.env.PORT || 9001;

app.listen(PORT, () => {
	console.log(`${Signs.okay} Server running in port: ${PORT}`);
});

startConnections();
