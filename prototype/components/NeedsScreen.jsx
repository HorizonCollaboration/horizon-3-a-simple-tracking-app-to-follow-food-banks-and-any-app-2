import { categories, foodBanks, needs } from '../sampleData.js';
import { useStoredState } from '../storage.js';
import Button from './Button.jsx';
import NeedBadge from './NeedBadge.jsx';
import ScreenHeading from './ScreenHeading.jsx';
import SummaryTiles from './SummaryTiles.jsx';

function whenUpdated(days) {
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';

    return `${days} days ago`;
}

function bankName(bankId) {
    return foodBanks.find((bank) => bank.id === bankId).name;
}

export default function NeedsScreen({ following, plannedNeedIds, onAdd, onRemove, onOpenBank, onGoToBanks, focusOnShow }) {
    const [scope, setScope] = useStoredState('needsScope', 'following');
    const [type, setType] = useStoredState('needsType', 'all');

    const inScope = needs.filter((need) => scope === 'all' || following.includes(need.bankId));
    const shown = inScope
        .filter((need) => type === 'all' || need.category === type)
        .sort(
            (a, b) =>
                (a.level === 'urgent' ? 0 : 1) - (b.level === 'urgent' ? 0 : 1) ||
                a.updatedDaysAgo - b.updatedDaysAgo ||
                a.item.localeCompare(b.item),
        );

    const urgentCount = inScope.filter((need) => need.level === 'urgent').length;
    const lowCount = inScope.length - urgentCount;
    const noneFollowed = scope === 'following' && following.length === 0;

    function actionFor(need) {
        const planned = plannedNeedIds.includes(need.id);

        return planned ? (
            <Button variant="outline" onClick={() => onRemove(need.id)} className="w-full md:w-auto">
                Remove from my list<span className="sr-only">: {need.item}</span>
            </Button>
        ) : (
            <Button onClick={() => onAdd(need.id)} className="w-full md:w-auto">
                Add to my list<span className="sr-only">: {need.item}</span>
            </Button>
        );
    }

    return (
        <div className="space-y-6">
            <ScreenHeading
                focusOnShow={focusOnShow}
                intro="Supplies food banks are short of right now, most urgent first. Add items to your list before you shop."
            >
                What&apos;s needed
            </ScreenHeading>

            <SummaryTiles
                tiles={[
                    { label: 'Urgent', value: urgentCount },
                    { label: 'Running low', value: lowCount },
                    { label: scope === 'all' ? 'Food banks' : 'Following', value: scope === 'all' ? foodBanks.length : following.length },
                ]}
            />

            <section aria-labelledby="filter-title" className="rounded-card bg-surface p-4 shadow-card">
                <h2 id="filter-title" className="font-display text-lg font-semibold text-ink">
                    Choose what to see
                </h2>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div>
                        <p id="scope-label" className="text-base font-medium text-ink">
                            Food banks
                        </p>
                        <div role="group" aria-labelledby="scope-label" className="mt-1 grid grid-cols-2 gap-2">
                            {[
                                { id: 'following', label: 'Ones I follow' },
                                { id: 'all', label: 'All' },
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    aria-pressed={scope === option.id}
                                    onClick={() => setScope(option.id)}
                                    className={`min-h-11 rounded-control border px-3 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                                        scope === option.id
                                            ? 'border-primary bg-primary-soft text-primary'
                                            : 'border-line bg-surface text-ink hover:bg-sunken'
                                    }`}
                                >
                                    {scope === option.id && <span aria-hidden="true">✓ </span>}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="type-filter" className="text-base font-medium text-ink">
                            Type of item
                        </label>
                        <select
                            id="type-filter"
                            value={type}
                            onChange={(event) => setType(event.target.value)}
                            className="mt-1 block min-h-11 w-full rounded-control border border-line bg-surface px-3 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <option value="all">All types</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section aria-labelledby="needs-title" className="rounded-card bg-surface shadow-card">
                <div className="flex items-baseline justify-between gap-2 border-b border-line p-4">
                    <h2 id="needs-title" className="font-display text-lg font-semibold text-ink">
                        Short right now
                    </h2>
                    <p className="text-base text-ink-muted">
                        {shown.length} {shown.length === 1 ? 'item' : 'items'}
                    </p>
                </div>

                {noneFollowed ? (
                    <div className="space-y-3 p-6 text-center">
                        <p className="text-base text-ink">You are not following any food banks yet.</p>
                        <p className="text-base text-ink-muted">Follow the ones near you to see what they need here.</p>
                        <Button onClick={onGoToBanks}>Choose food banks</Button>
                    </div>
                ) : shown.length === 0 ? (
                    <div className="space-y-3 p-6 text-center">
                        <p className="text-base text-ink">Nothing of this type is short right now.</p>
                        <Button variant="outline" onClick={() => setType('all')}>
                            Show all types
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Phone: one card per item */}
                        <ul className="divide-y divide-line md:hidden">
                            {shown.map((need) => (
                                <li key={need.id} className="space-y-2 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-base font-semibold text-ink">{need.item}</p>
                                        <NeedBadge level={need.level} />
                                    </div>
                                    <p className="text-base text-ink-muted">
                                        <button
                                            type="button"
                                            onClick={() => onOpenBank(need.bankId)}
                                            className="min-h-11 text-left font-medium text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        >
                                            {bankName(need.bankId)}
                                        </button>
                                        <span className="block">
                                            {need.category} · Updated {whenUpdated(need.updatedDaysAgo).toLowerCase()}
                                        </span>
                                    </p>
                                    {need.note && <p className="text-base text-ink">{need.note}</p>}
                                    {actionFor(need)}
                                </li>
                            ))}
                        </ul>

                        {/* Computer: a table */}
                        <table className="hidden w-full text-left text-base md:table">
                            <thead className="bg-sunken text-ink-muted">
                                <tr>
                                    <th scope="col" className="px-4 py-2 font-semibold">
                                        Item
                                    </th>
                                    <th scope="col" className="px-4 py-2 font-semibold">
                                        Food bank
                                    </th>
                                    <th scope="col" className="px-4 py-2 font-semibold">
                                        How short
                                    </th>
                                    <th scope="col" className="px-4 py-2 font-semibold">
                                        Updated
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-right font-semibold">
                                        <span className="sr-only">Action</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {shown.map((need) => (
                                    <tr key={need.id} className="align-top">
                                        <td className="px-4 py-3">
                                            <span className="block font-semibold text-ink">{need.item}</span>
                                            <span className="block text-ink-muted">{need.category}</span>
                                            {need.note && <span className="mt-1 block text-ink">{need.note}</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => onOpenBank(need.bankId)}
                                                className="text-left font-medium text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                            >
                                                {bankName(need.bankId)}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <NeedBadge level={need.level} />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-ink-muted">{whenUpdated(need.updatedDaysAgo)}</td>
                                        <td className="px-4 py-3 text-right">{actionFor(need)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </section>
        </div>
    );
}
