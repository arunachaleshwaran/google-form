import type { Field } from '../models';
import useFormsStore from '../Store';

export default function EachField({
  field,
  id,
}: {
  readonly field: Field;
  readonly id: number;
}) {
  const changeField = useFormsStore(state => state.changeField);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) => {
    console.log(event.target.value);
    const res = /(?<index>\d+)(?<fieldName>\w+)/u.exec(
      event.target.name
    );
    if (res === null) throw new Error('Invalid name attribute');
    const { index, fieldName } = res.groups;
    changeField(
      Number(index),
      fieldName as keyof Field,
      event.target.value
    );
  };
  return (
    <div className='question'>
      <fieldset id={`${id}`}>
        <label htmlFor={`${id}question`}>Question</label>
        <input
          id='question'
          name={`${id}question`}
          value={field.question}
          onChange={handleChange}
        />
        <label htmlFor={`${id}type`}>Type</label>
        <select
          id='type'
          name={`${id}type`}
          value={field.type}
          onChange={handleChange}>
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
          onChange={handleChange}
        />
      </fieldset>
    </div>
  );
}
