import type { ErrorRequestHandler } from 'express';
import express from 'express';

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((_, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  console.log('get /', req.query);
  res.json([
    { question: 'q1', type: 'number', required: true },
    { question: 'q2', type: 'text', required: false },
  ]);
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
