import { create } from "zustand";

interface FormState {
  name: string;
  email: string;
  message: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setMessage: (value: string) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
}

export const useFormStore = create<FormState>((set, get) => ({
  name: "",
  email: "",
  message: "",
  setName: (value) => set({ name: value }),
  setEmail: (value) => set({ email: value }),
  setMessage: (value) => set({ message: value }),
  resetForm: () => set({ name: "", email: "", message: "" }),

  submitForm: async () => {
    const { name, email, message } = get();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting form:", errorData);
        return;
      }

      console.log("Form submitted successfully");
      set({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Submission error:", error);
    }
  },
}));
