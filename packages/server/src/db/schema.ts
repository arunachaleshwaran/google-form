import type { WithId } from 'mongodb';

export type Field = {
  question: string;
  type: string;
  required: boolean;
};

export type Schema = {
  form: WithId<{
    title: string;
    fields: Array<Field>;
    answer_collection: string;
  }>;
};
