import express from 'express';
import cors from 'cors';
import status from 'http-status';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import dbConnection from './Connection/dbConnect';
import errorHandler from './Middlewares/errorHandler';
import Cards from './dbCards';

dbConnection();

const app = express();
const port = process.env.port || 8001;

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
	res.status(status.OK).send({ Message: 'Connected', status: status.OK });
});

/* POST a card to db */
app.post('/tinder/cards', (req, res) => {
	console.log('req', req);
	const dbCard = req.body;
	console.log('dbCard', dbCard);

	Cards.create(dbCard, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

/* GET a card to db */
app.get('/tinder/cards', (req, res) => {
	Cards.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	});
});

app.use(errorHandler);

app.listen(port, () =>
	console.log(`App listening On port http://localhost:${port}`),
);
