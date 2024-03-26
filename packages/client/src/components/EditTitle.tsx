import { useEffect, useState } from 'react';
import useFormsStore from '../Store';

export default function EditTitle() {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useFormsStore(state => [
    state.title,
    state.setTitle,
  ]);
  const [titleState, setTitleState] = useState(title);
  const updateTitle: React.FocusEventHandler<
    HTMLInputElement
  > = event => {
    setTitle(event.target.value);
    setIsEditing(false);
  };
  useEffect(() => {
    setTitleState(title);
  }, [title]);
  if (isEditing)
    return (
      <input
        name='title'
        value={titleState}
        onBlur={updateTitle}
        onChange={event => setTitleState(event.target.value)}
      />
    );
  return (
    <span onDoubleClick={() => setIsEditing(true)}>{title}</span>
  );
}
