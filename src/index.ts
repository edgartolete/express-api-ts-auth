import { Signs } from './Utils/constants';
import { generateId } from './Utils/helpers';
import { secure } from './Utils/secure';
import app from './app';

console.log('ENVIRONMENT:', process.env.API_ENV);

// secure.hash('162534').then(v => console.log(v));

app.listen(3000, () => {
	console.log(`${Signs.okay} Server running in port: 3000`);
});
