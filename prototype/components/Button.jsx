const base =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 py-2 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60';

const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-hover',
    outline: 'border border-line bg-surface text-ink hover:bg-sunken',
};

export default function Button({ variant = 'primary', className = '', type = 'button', ...props }) {
    return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
