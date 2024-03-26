import type { Field } from './models';
import { create } from 'zustand';

type FormsStore = {
  title: string;
  fields: Array<Readonly<Field>>;
  setTitle: (title: string) => void;
  load: (res: Pick<FormsStore, 'fields' | 'title'>) => void;
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
  title: '',
  fields: [] as Array<Readonly<Field>>,
  setTitle: title => {
    set({ title });
  },
  load: ({ fields, title }) => {
    set({ fields, title });
  },
  addField: () => {
    set(state => {
      const newState = [...state.fields];
      newState.push({ ...INITIAL_FIELD });
      return { fields: newState };
    });
  },
  removeField: (index: number) => {
    set(state => {
      const newState = [...state.fields];
      newState.splice(index, 1);
      return { fields: newState };
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
      const newState = [...state.fields];
      newState[index] = { ...newState[index], [name]: value };
      return { fields: newState };
    });
  },
}));
export default useFormsStore;
