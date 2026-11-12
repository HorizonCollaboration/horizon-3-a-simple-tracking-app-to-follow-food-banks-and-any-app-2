const styles = {
    urgent: { text: 'Urgent', className: 'bg-danger-soft text-danger', mark: '!' },
    low: { text: 'Running low', className: 'bg-warning-soft text-warning', mark: '•' },
    following: { text: 'Following', className: 'bg-primary-soft text-primary', mark: '✓' },
    given: { text: 'Given', className: 'bg-success-soft text-success', mark: '✓' },
    stocked: { text: 'Nothing short', className: 'bg-success-soft text-success', mark: '✓' },
};

export default function NeedBadge({ level, children }) {
    const style = styles[level];

    return (
        <span
            className={`inline-flex items-center gap-1 whitespace-nowrap rounded-control px-2 py-0.5 text-sm font-semibold ${style.className}`}
        >
            <span aria-hidden="true">{style.mark}</span>
            {children ?? style.text}
        </span>
    );
}
