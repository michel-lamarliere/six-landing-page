import express from 'express';
const app = express();

app.use('/', (req, res) => {
	res.send('hello');
});

app.listen(8080, () => {
	console.log('hello');
});
