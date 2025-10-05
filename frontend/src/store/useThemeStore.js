import {create} from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('flowtalk-theme') || 'coffee',
    setTheme: (theme) => {
        localStorage.setItem('flowtalk-theme', theme);
        set({theme})
    }
}))