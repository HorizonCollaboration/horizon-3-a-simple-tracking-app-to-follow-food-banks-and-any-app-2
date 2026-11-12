export default function SummaryTiles({ tiles }) {
    return (
        <dl className="grid grid-cols-3 gap-2 sm:gap-4">
            {tiles.map((tile) => (
                <div key={tile.label} className="rounded-card bg-surface p-3 shadow-card sm:p-4">
                    <dt className="text-sm text-ink-muted sm:text-base">{tile.label}</dt>
                    <dd className="mt-1 font-display text-2xl font-bold text-ink">{tile.value}</dd>
                </div>
            ))}
        </dl>
    );
}
