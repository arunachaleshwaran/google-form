import type { Field } from './models';
import { create } from 'zustand';

type FormsStore = {
  state: Array<Readonly<Field>>;
  load: (state: Array<Readonly<Field>>) => void;
  addField: () => void;
  removeField: (index: number) => void;
  changeField: <T extends keyof Field>(
    index: number,
    name: T,
    target: HTMLInputElement & HTMLSelectElement
  ) => void;
};
const INITIAL_FIELD: Field = {
  question: '',
  type: 'text',
  required: false,
};
const useFormsStore = create<FormsStore>()(set => ({
  state: [] as Array<Readonly<Field>>,
  load: state => {
    set({ state });
  },
  addField: () => {
    set(state => {
      const newState = [...state.state];
      newState.push({ ...INITIAL_FIELD });
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
  changeField: <T extends keyof Field>(
    index: number,
    name: T,
    target: HTMLInputElement & HTMLSelectElement
  ) => {
    let { value }: { value: Field[keyof Field] } = target;
    switch (target.type) {
      case 'checkbox':
        value = target.checked;
        break;
    }
    set(state => {
      const newState = [...state.state];
      newState[index] = { ...newState[index], [name]: value };
      return { state: newState };
    });
  },
}));
export default useFormsStore;
