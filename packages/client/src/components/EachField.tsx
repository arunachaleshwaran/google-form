import type { Field } from '../models';
import useFormsStore from '../Store';
export const parseFieldName = (name: string) => {
  const res = /(?<fieldName>\w+)-(?<index>\d+)/u.exec(name);
  if (res === null) throw new Error('Invalid name attribute');
  return res.groups as {
    index: `${number}`;
    fieldName: keyof Field;
  };
};
export default function EachField({
  field,
  id,
  preview,
}: {
  readonly field: Field;
  readonly id: number;
  readonly preview: boolean;
}) {
  const [changeField, removeField] = useFormsStore(state => [
    state.changeField,
    state.removeField,
  ]);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) => {
    const { index, fieldName } = parseFieldName(event.target.name);
    changeField(
      Number(index),
      fieldName as keyof Field,
      event.target
    );
  };
  if (preview)
    return (
      <fieldset id={`${id}`}>
        <legend>{`${field.question} ${field.required ? '*' : ''}`}</legend>
        <input name={field.question} type={field.type} />
      </fieldset>
    );
  return (
    <fieldset id={`${id}`}>
      <label htmlFor={`question-${id}`}>Question</label>
      <input
        name={`question-${id}`}
        value={field.question}
        onChange={handleChange}
      />
      <label htmlFor={`type-${id}`}>Type</label>
      <select
        name={`type-${id}`}
        value={field.type}
        onChange={handleChange}>
        <option value='text'>Text</option>
        <option value='number'>Number</option>
        <option value='date'>Date</option>
      </select>
      <label htmlFor={`required-${id}`}>Required</label>
      <input
        checked={field.required}
        name={`required-${id}`}
        type='checkbox'
        onChange={handleChange}
      />
      <button type='button' onClick={() => removeField(id)}>
        X
      </button>
    </fieldset>
  );
}
