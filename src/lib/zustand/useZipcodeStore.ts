import { create } from "zustand";

const useZipcodeStore = create((set) => ({
    zipcode: "",
    setZipcode: (zipcode: string) => set({ zipcode }),
    insights: "",
    setInsights: (insights: string) => set({ insights }),
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    coordinates: {x: 0, y: 0},
    setCoordinates: (coordinates: {x: number, y: number}) => set({ coordinates }),
}));

export default useZipcodeStore;