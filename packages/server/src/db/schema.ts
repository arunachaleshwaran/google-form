import type { WithId } from 'mongodb';

export type Field = {
  question: string;
  type: 'date' | 'number' | 'text';
  required: boolean;
};
type FieldTypeMapping = {
  date: Date;
  number: number;
  text: string;
};

type FormCollection = {
  title: string;
  fields: Array<Field>;
  answer_collection: `answers_${string}`;
};
export type Schema = Record<
  FormCollection['answer_collection'],
  WithId<Record<Field['question'], FieldTypeMapping[Field['type']]>>
> & {
  form: WithId<FormCollection>;
};
