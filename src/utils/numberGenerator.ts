import { create } from 'zustand';
const STORAGE_KEY = 'ochentera-game-v1';
export function restoreNumbers(value: unknown): number[] {
    if (!Array.isArray(value) || value.length > 90 || value.some(n => !Number.isInteger(n) || n < 1 || n > 90) || new Set(value).size !== value.length)
        return [];
    return value;
}
function loadGame(): number[] {
    try {
        return restoreNumbers(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    }
    catch {
        return [];
    }
}
interface NumberStore {
    history: number[];
    storageError: boolean;
    draw: () => void;
    reset: () => void;
}
export const useNumberStore = create<NumberStore>((set, get) => {
    const save = (history: number[]) => {
        let storageError = false;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        }
        catch {
            storageError = true;
        }
        set({ history, storageError });
    };
    return {
        history: loadGame(), storageError: false,
        draw: () => {
            const { history } = get();
            const used = new Set(history);
            const remaining = Array.from({ length: 90 }, (_, i) => i + 1).filter(n => !used.has(n));
            if (!remaining.length)
                return;
            save([...history, remaining[Math.floor(Math.random() * remaining.length)]]);
        },
        reset: () => save([]),
    };
});
