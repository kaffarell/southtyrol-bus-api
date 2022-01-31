import express from 'express';
import api from './routes/api';
import PinoHttp from 'pino-http';
import pino from 'pino';
const loggerHttp = PinoHttp();
const logger= pino();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(loggerHttp);

app.use('/api', api);

app.listen(port, () => {
    logger.info('Server listening on Port ' + port);
})