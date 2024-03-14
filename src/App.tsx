import './App.css';
import EachField from './components/EachField';
import type { Field } from './models';
// A
function App() {
  const InitialField: Field = {
    question: '',
    type: 'text',
    required: false,
  };
  const questions: Array<Field> = [
    { question: 'q1', type: 'number', required: true },
    { question: 'q2', type: 'text', required: false },
  ];
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
      <button type='submit'>Submit</button>
    </form>
  );
}

export default App;
