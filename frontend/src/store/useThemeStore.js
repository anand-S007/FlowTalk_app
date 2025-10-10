import {create} from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('flowtalk-theme') || 'forest',
    setTheme: (theme) => {
        localStorage.setItem('flowtalk-theme', theme);
        set({theme})
    }
}))