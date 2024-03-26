import type { ObjectId } from 'mongodb';

export type Field = {
  question: string;
  type: string;
  required: boolean;
};

export type Schema = {
  form: {
    _id: ObjectId;
    fields: Array<Field>;
    answer_collection: string;
  };
};
