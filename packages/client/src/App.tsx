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
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(formData);
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
