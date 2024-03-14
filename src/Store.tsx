import type { Field } from './models';
import { create } from 'zustand';

type FormsStore = {
  state: Array<Readonly<Field>>;
  changeField: <T extends keyof Field>(
    index: number,
    name: T,
    value: Field[T]
  ) => void;
};
const useFormsStore = create<FormsStore>()(set => ({
  state: [
    { question: 'q1', type: 'number', required: true },
    { question: 'q2', type: 'text', required: false },
  ] as Array<Field>,
  changeField: (index, name, value) => {
    set(state => {
      const newState = [...state.state];
      newState[index] = { ...newState[index], [name]: value };
      return { state: newState };
    });
  },
}));
export default useFormsStore;
