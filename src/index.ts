import express from 'express';
import api from './routes/api';

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api', api);


app.listen(port, () => {
    console.log('Server listening on Port ' + port);
})