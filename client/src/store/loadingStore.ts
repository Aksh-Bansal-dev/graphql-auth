import create from "zustand";
import { combine } from "zustand/middleware";

const useLoading = create(
  combine({ isLoading: false }, (set) => ({
    setLoading: (x: boolean) => set((state) => ({ isLoading: x })),
  }))
);

export default useLoading;
