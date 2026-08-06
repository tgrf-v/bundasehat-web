import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-slate-300 text-rose-600 shadow-sm outline-none focus:outline-none focus-visible:outline-none focus:ring-rose-500 ' +
                className
            }
        />
    );
}
