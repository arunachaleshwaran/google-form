import type { ErrorRequestHandler } from 'express';
import cors from 'cors';
import express from 'express';

const PORT = 3000;
const app = express();
app.use(
  cors({
    origin: 'http://localhost:4000',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = {
  one: [
    { question: 'q1', type: 'number', required: true },
    { question: 'q2', type: 'text', required: false },
  ],
};
app.get('/', (_, res) => {
  res.json(store.one);
});
app.post('/', (req, res) => {
  store.one = req.body;
  res.send();
});
const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
  next();
};
app.use(errorHandler);
app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
