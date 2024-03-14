import type { Field } from '../models';

export default function EachField({
  field,
  id,
}: {
  readonly field: Field;
  readonly id: number;
}) {
  return (
    <div className='question'>
      <label htmlFor={`${id}name`}>Question</label>
      <input id='name' name={`${id}name`} value={field.question} />
      <label htmlFor={`${id}type`}>Type</label>
      <select id='type' name={`${id}type`} value={field.type}>
        <option value='text'>Text</option>
        <option value='number'>Number</option>
        <option value='date'>Date</option>
      </select>
      <label htmlFor={`${id}required`}>Required</label>
      <input
        checked={field.required}
        id='required'
        name={`${id}required`}
        type='checkbox'
      />
    </div>
  );
}
