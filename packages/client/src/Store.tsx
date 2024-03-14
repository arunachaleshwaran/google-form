import type { Field } from './models';
import { create } from 'zustand';

type FormsStore = {
  state: Array<Readonly<Field>>;
  addField: () => void;
  removeField: (index: number) => void;
  changeField: <T extends keyof Field>(
    index: number,
    name: T,
    value: Field[T]
  ) => void;
};
const InitialField: Field = {
  question: '',
  type: 'text',
  required: false,
};
const useFormsStore = create<FormsStore>()(set => ({
  state: [
    { question: 'q1', type: 'number', required: true },
    { question: 'q2', type: 'text', required: false },
  ] as Array<Field>,
  addField: () => {
    set(state => {
      const newState = [...state.state];
      newState.push({ ...InitialField });
      return { state: newState };
    });
  },
  removeField: (index: number) => {
    set(state => {
      const newState = [...state.state];
      newState.splice(index, 1);
      return { state: newState };
    });
  },
  changeField: (index, name, value) => {
    set(state => {
      const newState = [...state.state];
      newState[index] = { ...newState[index], [name]: value };
      return { state: newState };
    });
  },
}));
export default useFormsStore;
