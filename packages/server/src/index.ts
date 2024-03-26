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

app.get('/', async (_, res) => {
  const client = await connect();
  const forms = collection(client, 'form');
  const result = await forms.findOne({
    _id: new ObjectId('65fc6cb83ca29c14880f8450'),
  });
  await client.close();
  res.json(result?.fields ?? []);
});
app.post<'/', unknown, undefined, Schema['form']['fields'], {}>(
  '/',
  async (req, res) => {
    const client = await connect();
    const forms = collection(client, 'form');
    await forms.updateOne(
      {
        _id: new ObjectId('65fc6cb83ca29c14880f8450'),
      },
      {
        $set: {
          fields: req.body,
        },
      }
    );
    await client.close();
    res.send();
  }
);
const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
  next();
};
app.use(errorHandler);
app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
