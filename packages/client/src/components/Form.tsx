import EachField, { parseFieldName } from '../components/EachField';
import EditTitle from '../components/EditTitle';
import type { Field } from '../models';
import useFormsStore from '../Store';
import { useQuery } from '@tanstack/react-query';
export default function Form({ id }: { readonly id: string }) {
  const [fields, addField, load] = useFormsStore(state => [
    state.fields,
    state.addField,
    state.load,
  ]);
  useQuery<Parameters<typeof load>[0]>({
    queryKey: ['questions'],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/form/${id}`);
      const data = (await res.json()) as Parameters<typeof load>[0];
      load(data);
      return data;
    },
  });
  const parseDataFromForm = (formData: FormData): Array<Field> => {
    type Property = keyof Field;
    const questionList: Array<
      Partial<Record<Property, Field[Property]>>
    > = [];
    for (const [key, value] of formData) {
      const {
        index,
        fieldName,
      }: { index: `${number}`; fieldName: Property } =
        parseFieldName(key);
      const eachField = questionList[Number(index)] ?? {};
      switch (fieldName) {
        case 'required':
          eachField[fieldName] = value === 'on';
          break;
        default:
          eachField[fieldName] = value as Field[Property];
      }
      questionList[Number(index)] = eachField;
    }
    // Enter Default values
    for (const question of questionList) {
      if (!('required' in question)) question.required = false;
    }
    return questionList as Array<Field>;
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get('title') as string;
    formData.delete('title');
    const currFields = parseDataFromForm(formData);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    void fetch(`http://localhost:3000/form/${id}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, fields: currFields }),
      redirect: 'follow',
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <EditTitle />
      {fields.map((field, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <EachField key={index} field={field} id={index} />
      ))}
      <button type='button' onClick={addField}>
        Add Field
      </button>
      <button type='submit'>Submit</button>
    </form>
  );
}
