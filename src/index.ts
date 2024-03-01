import { Signs } from './Utils/constants';
import app from './app';

console.log('ENVIRONMENT:', process.env.API_ENV);

const PORT = process.env.PORT || 9001;

app.listen(PORT, () => {
	console.log(`${Signs.okay} Server running in port: ${PORT}`);
});
