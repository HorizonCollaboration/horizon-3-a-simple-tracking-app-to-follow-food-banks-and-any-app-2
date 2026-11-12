import { useEffect, useState } from 'react';
import { initialFollowing, initialPlan, needs, foodBanks } from './sampleData.js';
import { useStoredState } from './storage.js';
import FoodBanksScreen from './components/FoodBanksScreen.jsx';
import MyListScreen from './components/MyListScreen.jsx';
import NeedsScreen from './components/NeedsScreen.jsx';

function NeedsIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5h10M9 12h10M9 19h10" strokeLinecap="round" />
            <circle cx="4.5" cy="5" r="1.5" />
            <circle cx="4.5" cy="12" r="1.5" />
            <circle cx="4.5" cy="19" r="1.5" />
        </svg>
    );
}

function BanksIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10 12 4l9 6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 10v9h14v-9M10 19v-5h4v5" strokeLinejoin="round" />
        </svg>
    );
}

function ListIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 8h16l-1.5 11h-13L4 8Z" strokeLinejoin="round" />
            <path d="M9 8a3 3 0 0 1 6 0" />
        </svg>
    );
}

const tabs = [
    { id: 'needs', label: "What's needed", Icon: NeedsIcon },
    { id: 'banks', label: 'Food banks', Icon: BanksIcon },
    { id: 'list', label: 'My list', Icon: ListIcon },
];

export default function App() {
    const [tab, setTab] = useStoredState('tab', 'needs');
    const [following, setFollowing] = useStoredState('following', initialFollowing);
    const [plan, setPlan] = useStoredState('plan', initialPlan);
    const [openBankId, setOpenBankId] = useStoredState('openBank', null);
    const [message, setMessage] = useState('');
    const [moved, setMoved] = useState(false);

    useEffect(() => {
        if (!message) return undefined;
        const timer = setTimeout(() => setMessage(''), 6000);

        return () => clearTimeout(timer);
    }, [message]);

    const toTake = plan.filter((entry) => !entry.givenOn);
    const plannedNeedIds = toTake.map((entry) => entry.needId);

    const itemName = (needId) => needs.find((need) => need.id === needId)?.item ?? 'Item';
    const bankName = (bankId) => foodBanks.find((bank) => bank.id === bankId).name;

    function goTo(nextTab) {
        setTab(nextTab);
        if (nextTab === 'banks') setOpenBankId(null);
        setMessage('');
        setMoved(true);
    }

    function openBank(bankId) {
        setTab('banks');
        setOpenBankId(bankId);
        setMessage('');
        setMoved(true);
    }

    function toggleFollow(bankId) {
        if (following.includes(bankId)) {
            setFollowing(following.filter((id) => id !== bankId));
            setMessage(`You stopped following ${bankName(bankId)}.`);
        } else {
            setFollowing([...following, bankId]);
            setMessage(`You are now following ${bankName(bankId)}. Their needs will show on What's needed.`);
        }
    }

    function addToList(needId) {
        setPlan([...plan, { id: `p${Date.now()}`, needId, plannedOn: new Date().toISOString(), givenOn: null }]);
        setMessage(`Added ${itemName(needId)} to your list.`);
    }

    function removeNeedFromList(needId) {
        setPlan(plan.filter((entry) => entry.givenOn || entry.needId !== needId));
        setMessage(`Removed ${itemName(needId)} from your list.`);
    }

    function removePlan(planId) {
        const entry = plan.find((e) => e.id === planId);
        setPlan(plan.filter((e) => e.id !== planId));
        setMessage(`Removed ${itemName(entry.needId)} from your list.`);
    }

    function markGiven(planId) {
        const entry = plan.find((e) => e.id === planId);
        setPlan(plan.map((e) => (e.id === planId ? { ...e, givenOn: new Date().toISOString() } : e)));
        setMessage(`Thank you. ${itemName(entry.needId)} is marked as given.`);
    }

    return (
        <div className="min-h-screen bg-canvas text-ink">
            <header className="border-b border-line bg-surface">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4">
                    <p className="py-4 font-display text-xl font-bold text-ink">Food bank needs</p>
                    <nav aria-label="Screens" className="hidden md:block">
                        <ul className="flex gap-1">
                            {tabs.map(({ id, label, Icon }) => (
                                <li key={id}>
                                    <button
                                        type="button"
                                        onClick={() => goTo(id)}
                                        aria-current={tab === id ? 'page' : undefined}
                                        className={`flex min-h-16 items-center gap-2 border-b-2 px-4 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                            tab === id ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
                                        }`}
                                    >
                                        <Icon />
                                        {label}
                                        {id === 'list' && toTake.length > 0 && (
                                            <span className="rounded-control bg-primary-soft px-2 text-sm text-primary">
                                                {toTake.length}
                                                <span className="sr-only"> to take</span>
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 pb-32 pt-6 md:pb-12">
                {tab === 'needs' && (
                    <NeedsScreen
                        following={following}
                        plannedNeedIds={plannedNeedIds}
                        onAdd={addToList}
                        onRemove={removeNeedFromList}
                        onOpenBank={openBank}
                        onGoToBanks={() => goTo('banks')}
                        focusOnShow={moved}
                    />
                )}
                {tab === 'banks' && (
                    <FoodBanksScreen
                        openBankId={openBankId}
                        onOpenBank={openBank}
                        following={following}
                        onToggleFollow={toggleFollow}
                        plannedNeedIds={plannedNeedIds}
                        onAdd={addToList}
                        onRemove={removeNeedFromList}
                        focusOnShow={moved}
                    />
                )}
                {tab === 'list' && (
                    <MyListScreen
                        plan={plan}
                        onMarkGiven={markGiven}
                        onRemovePlan={removePlan}
                        onGoToNeeds={() => goTo('needs')}
                        onOpenBank={openBank}
                        focusOnShow={moved}
                    />
                )}
            </main>

            <div role="status" aria-live="polite" className="fixed inset-x-0 bottom-20 z-20 px-4 md:bottom-6">
                {message && (
                    <p className="mx-auto flex max-w-xl items-center justify-between gap-3 rounded-card border border-success bg-success-soft p-3 text-base text-success shadow-card">
                        <span>
                            <span aria-hidden="true">✓ </span>
                            {message}
                        </span>
                        <button
                            type="button"
                            onClick={() => setMessage('')}
                            className="min-h-11 shrink-0 rounded-control px-2 font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            Close
                        </button>
                    </p>
                )}
            </div>

            <nav aria-label="Screens" className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface md:hidden">
                <ul className="grid grid-cols-3">
                    {tabs.map(({ id, label, Icon }) => (
                        <li key={id}>
                            <button
                                type="button"
                                onClick={() => goTo(id)}
                                aria-current={tab === id ? 'page' : undefined}
                                className={`relative flex min-h-16 w-full flex-col items-center justify-center gap-1 px-1 py-2 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                                    tab === id ? 'bg-primary-soft text-primary' : 'text-ink-muted hover:text-ink'
                                }`}
                            >
                                <Icon />
                                <span>
                                    {label}
                                    {id === 'list' && toTake.length > 0 && (
                                        <span className="ml-1 rounded-control bg-primary px-1.5 text-on-primary">
                                            {toTake.length}
                                            <span className="sr-only"> to take</span>
                                        </span>
                                    )}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
