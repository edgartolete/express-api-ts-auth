import app from './app';
import { startConnections } from './Connections/startConnections';
import { Signs } from './Utils/constants';

const PORT = process.env.PORT || 9001;

app.listen(PORT, () => {
	console.log(`${Signs.okay} Server running in port: ${PORT}`);
});

startConnections();
