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

type GetIDType =
  | [
      Record<string, never>,
      Array<Pick<Schema['form'], '_id' | 'title'>>,
    ]
  | [{ id: Schema['form']['_id'] }, Schema['form']];
app.get<
  '/form/:id',
  GetIDType[0],
  GetIDType[1],
  undefined,
  Record<string, never>
>('/form/:id', async (req, res, next) => {
  const client = await connect();
  const forms = collection(client, 'form');
  let result: Parameters<typeof res.json>[0] | null = null;
  if ('id' in req.params) {
    result = await forms.findOne(
      {
        _id: new ObjectId(req.params.id),
      },
      { projection: { _id: 0 } }
    );
    if (result) res.json(result);
    else next(new Error('Form not found'));
  } else {
    result = await forms
      .find({}, { projection: { title: 1 } })
      .toArray();
    res.json(result);
  }
  await client.close();
});
app.post<
  '/form/:id',
  { id: Schema['form']['_id'] },
  undefined,
  Pick<Schema['form'], 'fields' | 'title'>,
  Record<string, never>
>('/form/:id', async (req, res) => {
  const client = await connect();
  const forms = collection(client, 'form');
  const { fields, title } = req.body;
  await forms.updateOne(
    {
      _id: new ObjectId(req.params.id),
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
const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  console.error(err);
  res.status(500).send('Something broke!');
};
app.use(errorHandler);
app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
