import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthenStore = create(persist(
    (set) => ({
        // Global state store
        isLoggedIn: false,
        user: null,

        // Actions: Các hàm để cập nhật global state
        login: (user) => set({ isLoggedIn: true, user }),
        logout: () => set({ isLoggedIn: false, user: null })
    }), {
        name: "authen-state"
    }
));

export default useAuthenStore;