import { create } from "zustand";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
  setField: (
    field: keyof Omit<ContactFormData, "setField">,
    value: string
  ) => void;
  resetForm: () => void;
};

export const useContactStore = create<ContactFormData>((set) => ({
  name: "",
  email: "",
  message: "",
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  resetForm: () => set({ name: "", email: "", message: "" }),
}));
