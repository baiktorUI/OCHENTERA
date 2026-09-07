import { useEffect, useRef, type ReactNode } from 'react';
export function Modal({ children, label, onClose }: {
    children: ReactNode;
    label: string;
    onClose: () => void;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const dialog = ref.current;
        dialog?.showModal();
        return () => dialog?.close();
    }, []);
    return <dialog ref={ref} className="dialog" aria-labelledby={label} onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => {
            if (event.key !== 'Tab')
                return;
            const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            }
            else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        }}>{children}</dialog>;
}
