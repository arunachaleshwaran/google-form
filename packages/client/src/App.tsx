import './App.css';
import EachField, { parseFieldName } from './components/EachField';
import type { Field } from './models';
import useFormsStore from './Store';
import { useQuery } from '@tanstack/react-query';
function App() {
  const [questions, addField, load] = useFormsStore(state => [
    state.state,
    state.addField,
    state.load,
  ]);
  useQuery<Array<Field>>({
    queryKey: ['questions'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/');
      const data = (await res.json()) as Array<Field>;
      load(data);
      return data;
    },
    initialData: [],
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
    const questionList = parseDataFromForm(
      new FormData(event.target as HTMLFormElement)
    );
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    void fetch('http://localhost:3000/', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(questionList),
      redirect: 'follow',
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      {questions.map((field, index) => (
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

export default App;
