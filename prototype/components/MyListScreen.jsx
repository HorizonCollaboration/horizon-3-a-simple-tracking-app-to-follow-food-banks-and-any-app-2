import { foodBanks, needs } from '../sampleData.js';
import Button from './Button.jsx';
import NeedBadge from './NeedBadge.jsx';
import ScreenHeading from './ScreenHeading.jsx';
import SummaryTiles from './SummaryTiles.jsx';

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-GB');
}

export default function MyListScreen({ plan, onMarkGiven, onRemovePlan, onGoToNeeds, onOpenBank, focusOnShow }) {
    const withDetails = plan
        .map((entry) => ({ ...entry, need: needs.find((need) => need.id === entry.needId) }))
        .filter((entry) => entry.need);
    const toTake = withDetails.filter((entry) => !entry.givenOn);
    const given = withDetails.filter((entry) => entry.givenOn).sort((a, b) => b.givenOn.localeCompare(a.givenOn));
    const banksToVisit = foodBanks.filter((bank) => toTake.some((entry) => entry.need.bankId === bank.id));

    return (
        <div className="space-y-6">
            <ScreenHeading focusOnShow={focusOnShow} intro="What you plan to give, sorted by food bank, with drop-off times.">
                My donation list
            </ScreenHeading>

            <SummaryTiles
                tiles={[
                    { label: 'To take', value: toTake.length },
                    { label: 'Places to go', value: banksToVisit.length },
                    { label: 'Given', value: given.length },
                ]}
            />

            {toTake.length === 0 ? (
                <section className="space-y-3 rounded-card bg-surface p-6 text-center shadow-card">
                    <h2 className="font-display text-lg font-semibold text-ink">Nothing to take yet</h2>
                    <p className="text-base text-ink-muted">Add items from What&apos;s needed and they will appear here.</p>
                    <Button onClick={onGoToNeeds}>See what&apos;s needed</Button>
                </section>
            ) : (
                banksToVisit.map((bank) => (
                    <section key={bank.id} aria-labelledby={`take-${bank.id}`} className="rounded-card bg-surface shadow-card">
                        <div className="border-b border-line p-4">
                            <h2 id={`take-${bank.id}`} className="font-display text-lg font-semibold text-ink">
                                Take to {bank.name}
                            </h2>
                            <p className="mt-1 text-base text-ink-muted">
                                {bank.dropOffPlace}. {bank.dropOffTimes}.
                            </p>
                            <button
                                type="button"
                                onClick={() => onOpenBank(bank.id)}
                                className="mt-1 min-h-11 text-left text-base font-medium text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                See everything they need<span className="sr-only"> at {bank.name}</span>
                            </button>
                        </div>
                        <ul className="divide-y divide-line">
                            {toTake
                                .filter((entry) => entry.need.bankId === bank.id)
                                .map((entry) => (
                                    <li key={entry.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-base font-semibold text-ink">{entry.need.item}</span>
                                                <NeedBadge level={entry.need.level} />
                                            </div>
                                            {entry.need.note && <p className="text-base text-ink">{entry.need.note}</p>}
                                            <p className="text-base text-ink-muted">Added {formatDate(entry.plannedOn)}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 sm:flex">
                                            <Button onClick={() => onMarkGiven(entry.id)}>
                                                Mark as given<span className="sr-only">: {entry.need.item}</span>
                                            </Button>
                                            <Button variant="outline" onClick={() => onRemovePlan(entry.id)}>
                                                Remove<span className="sr-only">: {entry.need.item}</span>
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </section>
                ))
            )}

            <section aria-labelledby="given-title" className="rounded-card bg-surface shadow-card">
                <h2 id="given-title" className="border-b border-line p-4 font-display text-lg font-semibold text-ink">
                    Already given
                </h2>
                {given.length === 0 ? (
                    <p className="p-4 text-base text-ink-muted">
                        Nothing yet. When you drop something off, choose Mark as given and it will show here.
                    </p>
                ) : (
                    <table className="w-full text-left text-base">
                        <thead className="bg-sunken text-ink-muted">
                            <tr>
                                <th scope="col" className="px-4 py-2 font-semibold">
                                    Item
                                </th>
                                <th scope="col" className="hidden px-4 py-2 font-semibold sm:table-cell">
                                    Food bank
                                </th>
                                <th scope="col" className="px-4 py-2 text-right font-semibold">
                                    Given on
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {given.map((entry) => {
                                const bank = foodBanks.find((b) => b.id === entry.need.bankId);

                                return (
                                    <tr key={entry.id} className="align-top">
                                        <td className="px-4 py-3">
                                            <span className="flex flex-wrap items-center gap-2">
                                                <span className="font-semibold text-ink">{entry.need.item}</span>
                                                <NeedBadge level="given" />
                                            </span>
                                            <span className="block text-ink-muted sm:hidden">{bank.name}</span>
                                        </td>
                                        <td className="hidden px-4 py-3 text-ink sm:table-cell">{bank.name}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right text-ink">{formatDate(entry.givenOn)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}
