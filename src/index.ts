import express from 'express';
import api from './routes/api';


const app = express();

app.use(express.json());

app.use('/api', api);


app.listen(5000, () => {
    console.log('Server listening on Port 5000');
})