import { collection, connect } from './db/mongo.js';
import type { ErrorRequestHandler } from 'express';
import ExpressError from './express-error.js';
import HttpStatusCode from './HttpStatusCode.js';
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
app.post<
  '/answer/:id',
  { id: Schema['form']['_id'] },
  undefined,
  Schema[Schema['form']['answer_collection']],
  Record<string, never>
  // eslint-disable-next-line max-statements
>('/answer/:id', async (req, res, next) => {
  const { id } = req.params;
  const client = await connect();
  const forms = collection(client, 'form');
  const form = await forms.findOne(
    {
      _id: new ObjectId(id),
    },
    // eslint-disable-next-line camelcase
    { projection: { fields: 1, answer_collection: 1 } }
  );
  if (!form) {
    next(new ExpressError('Form not found', HttpStatusCode.NotFound));
    await client.close();
    return;
  }
  const { answer_collection: answerCollection } = form;
  const answers = collection(client, answerCollection);
  const answer = req.body;
  await answers.insertOne(answer);
  await client.close();
  res.send();
});
const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  console.error(err);
  if (err instanceof ExpressError)
    res.status(err.status).send(err.message);
  else
    res
      .status(HttpStatusCode.InternalServerError)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-member-access
      .send(err?.message || 'Something went wrong');
};
app.use(errorHandler);
app.listen(PORT, () => {
  console.log('Example app listening on port 3000!');
});
