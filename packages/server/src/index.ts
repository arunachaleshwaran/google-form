import { collection, connect } from './db/mongo.js';
import type { ErrorRequestHandler } from 'express';
import { ObjectId } from 'mongodb';
import type { Schema } from './db/schema.js';
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

app.get('/', async (_, res, next) => {
  const client = await connect();
  const forms = collection(client, 'form');
  const result = await forms.findOne({
    _id: new ObjectId('65fc6cb83ca29c14880f8450'),
  });
  await client.close();
  if (!result) {
    next(new Error('Form not found'));
    return;
  }
  res.json(result);
});
app.post<
  '/',
  unknown,
  undefined,
  Pick<Schema['form'], 'fields' | 'title'>,
  Record<string, never>
>('/', async (req, res) => {
  const client = await connect();
  const forms = collection(client, 'form');
  const { fields, title } = req.body;
  await forms.updateOne(
    {
      _id: new ObjectId('65fc6cb83ca29c14880f8450'),
    },
    {
      $set: {
        fields,
        title,
      },
    }
  );
  await client.close();
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
