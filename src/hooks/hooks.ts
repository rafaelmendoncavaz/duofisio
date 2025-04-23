import { useRef, useEffect, type RefObject } from "react";
import { useAPI } from "../store/store";

// Hook para detectar cliques fora de um elemento
export function useOutClick(callback: () => void): RefObject<HTMLDivElement> {
    const { clearRecord, clearRecords } = useAPI();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callback();
                clearRecord();
                clearRecords();
            }
        };

        window.addEventListener("mousedown", handleClick);

        return () => {
            window.removeEventListener("mousedown", handleClick);
        };
    }, [callback, clearRecord, clearRecords]);

    return ref;
}

// Hook para detectar pressionamento de tecla em qualquer elemento
export function useKeyDown<T extends HTMLElement = HTMLButtonElement>(
    key: KeyboardEvent["key"],
    callback: (element: T | null) => void
): RefObject<T> {
    const { clearRecord, clearRecords } = useAPI();
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === key) {
                callback(ref.current);
                clearRecord();
                clearRecords();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [key, callback, clearRecord, clearRecords]);

    return ref;
}
