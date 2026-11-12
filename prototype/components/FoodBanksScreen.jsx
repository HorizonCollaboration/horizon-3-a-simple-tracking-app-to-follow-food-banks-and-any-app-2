import { foodBanks, needs } from '../sampleData.js';
import Button from './Button.jsx';
import NeedBadge from './NeedBadge.jsx';
import ScreenHeading from './ScreenHeading.jsx';

function whenUpdated(days) {
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';

    return `${days} days ago`;
}

function FollowButton({ bank, isFollowing, onToggleFollow }) {
    return isFollowing ? (
        <Button variant="outline" onClick={() => onToggleFollow(bank.id)}>
            Stop following<span className="sr-only"> {bank.name}</span>
        </Button>
    ) : (
        <Button onClick={() => onToggleFollow(bank.id)}>
            Follow<span className="sr-only"> {bank.name}</span>
        </Button>
    );
}

function NeedCounts({ bankNeeds }) {
    const urgent = bankNeeds.filter((need) => need.level === 'urgent').length;
    const low = bankNeeds.length - urgent;

    if (bankNeeds.length === 0) return <NeedBadge level="stocked" />;

    return (
        <>
            {urgent > 0 && <NeedBadge level="urgent">{urgent} urgent</NeedBadge>}
            {low > 0 && <NeedBadge level="low">{low} running low</NeedBadge>}
        </>
    );
}

function BankDetail({ bank, isFollowing, onToggleFollow, onBack, plannedNeedIds, onAdd, onRemove, focusOnShow }) {
    const bankNeeds = needs
        .filter((need) => need.bankId === bank.id)
        .sort((a, b) => (a.level === 'urgent' ? 0 : 1) - (b.level === 'urgent' ? 0 : 1));

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={onBack}>
                <span aria-hidden="true">←</span> Back to all food banks
            </Button>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <ScreenHeading focusOnShow={focusOnShow} intro={`${bank.area} · Needs updated ${whenUpdated(bank.updatedDaysAgo)}`}>
                    {bank.name}
                </ScreenHeading>
                <div className="flex flex-wrap items-center gap-2">
                    {isFollowing && <NeedBadge level="following" />}
                    <FollowButton bank={bank} isFollowing={isFollowing} onToggleFollow={onToggleFollow} />
                </div>
            </div>

            <section aria-labelledby="short-title" className="rounded-card bg-surface shadow-card">
                <h2 id="short-title" className="border-b border-line p-4 font-display text-lg font-semibold text-ink">
                    Short right now
                </h2>
                {bankNeeds.length === 0 ? (
                    <p className="p-6 text-center text-base text-ink">
                        Nothing is short here right now. Check back soon, or look at another food bank.
                    </p>
                ) : (
                    <ul className="divide-y divide-line">
                        {bankNeeds.map((need) => {
                            const planned = plannedNeedIds.includes(need.id);

                            return (
                                <li key={need.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-base font-semibold text-ink">{need.item}</span>
                                            <NeedBadge level={need.level} />
                                        </div>
                                        <p className="text-base text-ink-muted">{need.category}</p>
                                        {need.note && <p className="text-base text-ink">{need.note}</p>}
                                    </div>
                                    {planned ? (
                                        <Button variant="outline" onClick={() => onRemove(need.id)} className="w-full sm:w-auto">
                                            Remove from my list<span className="sr-only">: {need.item}</span>
                                        </Button>
                                    ) : (
                                        <Button onClick={() => onAdd(need.id)} className="w-full sm:w-auto">
                                            Add to my list<span className="sr-only">: {need.item}</span>
                                        </Button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            <div className="grid gap-6 md:grid-cols-2">
                <section aria-labelledby="plenty-title" className="rounded-card bg-surface p-4 shadow-card">
                    <h2 id="plenty-title" className="font-display text-lg font-semibold text-ink">
                        They have plenty of
                    </h2>
                    <p className="mt-1 text-base text-ink-muted">Please give something else for now.</p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-ink">
                        {bank.plenty.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section aria-labelledby="dropoff-title" className="rounded-card bg-surface p-4 shadow-card">
                    <h2 id="dropoff-title" className="font-display text-lg font-semibold text-ink">
                        Where and when to drop off
                    </h2>
                    <dl className="mt-3 space-y-3 text-base">
                        <div>
                            <dt className="text-ink-muted">Where</dt>
                            <dd className="text-ink">{bank.dropOffPlace}</dd>
                        </div>
                        <div>
                            <dt className="text-ink-muted">When</dt>
                            <dd className="text-ink">{bank.dropOffTimes}</dd>
                        </div>
                    </dl>
                </section>
            </div>
        </div>
    );
}

export default function FoodBanksScreen({ openBankId, onOpenBank, following, onToggleFollow, plannedNeedIds, onAdd, onRemove, focusOnShow }) {
    const openBank = foodBanks.find((bank) => bank.id === openBankId);

    if (openBank) {
        return (
            <BankDetail
                key={openBank.id}
                bank={openBank}
                isFollowing={following.includes(openBank.id)}
                onToggleFollow={onToggleFollow}
                onBack={() => onOpenBank(null)}
                plannedNeedIds={plannedNeedIds}
                onAdd={onAdd}
                onRemove={onRemove}
                focusOnShow={focusOnShow}
            />
        );
    }

    return (
        <div className="space-y-6">
            <ScreenHeading focusOnShow={focusOnShow} intro="Follow the food banks you give to. Their needs will show on the What's needed screen.">
                Food banks
            </ScreenHeading>

            <ul className="grid gap-4 md:grid-cols-2">
                {foodBanks.map((bank) => {
                    const isFollowing = following.includes(bank.id);
                    const bankNeeds = needs.filter((need) => need.bankId === bank.id);

                    return (
                        <li key={bank.id} className="flex flex-col rounded-card bg-surface p-4 shadow-card">
                            <div className="flex items-start justify-between gap-3">
                                <h2 className="font-display text-lg font-semibold text-ink">{bank.name}</h2>
                                {isFollowing && <NeedBadge level="following" />}
                            </div>
                            <p className="mt-1 text-base text-ink-muted">
                                {bank.area} · Updated {whenUpdated(bank.updatedDaysAgo)}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <NeedCounts bankNeeds={bankNeeds} />
                            </div>
                            <p className="mt-3 text-base text-ink">
                                <span className="text-ink-muted">Drop off: </span>
                                {bank.dropOffTimes}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2 pt-1 sm:mt-auto">
                                <Button variant="outline" onClick={() => onOpenBank(bank.id)}>
                                    See what they need<span className="sr-only"> at {bank.name}</span>
                                </Button>
                                <FollowButton bank={bank} isFollowing={isFollowing} onToggleFollow={onToggleFollow} />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
