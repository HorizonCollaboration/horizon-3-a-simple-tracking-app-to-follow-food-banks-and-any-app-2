# Food Bank Needs

The brief this app is built from, approved on Horizon.

## What it's for
Food banks often run short of particular items, and people who want to donate don't know what's needed until they turn up. This app lets anyone see, at a glance, what each food bank is short of right now, so donations go where they're most useful. It helps busy, well-meaning donors like Dave, who wants to tailor what he gives rather than guess.

## Who uses it
Anyone can browse without signing in: they can see the list of food banks, their details, and what each one needs. To personalise the experience, people must sign in with an emailed link. Once signed in, someone can follow food banks they care about, build their own donation list, mark items as given, and add or update food banks and their needs so the community keeps the information current.

## Screens
**Food banks** – A list of food banks with their area, how recently their needs were updated, a quick count of urgent and low items, and their drop-off times. Anyone can open a food bank to see full details: what they need right now (most urgent first), what they already have plenty of, and where and when to drop things off. Signed-in people see a Follow or Stop following button here, and can add items to or remove items from their donation list. Signed-in people can also add a new food bank or edit one's details, drop-off information, and list of needs (adding a need, changing its urgency, or marking it as no longer needed); they can delete entries they added.

**What's needed** – A combined, filterable list of needs across food banks, most urgent first, with a toggle between "Food banks I follow" and "All" (the "follow" view and following itself need sign-in; signed-out visitors just see "All") and a filter by type of item. Each row shows the item, its food bank, how short it is, and when it was last updated, with a button to add or remove it from the signed-in person's donation list. If nobody is followed yet, it invites the person to go and follow some food banks. If a filter matches nothing, it offers to clear the filter.

**My list** (signed in only) – The signed-in person's own donation list, grouped by food bank with drop-off details, split into "still to take" and "already given". They can mark an item as given (recording the date) or remove it. If the list is empty, it invites them to go to What's needed. Signed-out visitors are sent to sign in if they try to reach this screen.

All screens show a sign-in link or button where relevant, and a brief confirmation message after actions like following, adding, removing, or marking as given.

## What it keeps
- **People**: an email address, used to sign in by emailed link.
- **Food banks** (shared, visible to everyone): name, area, drop-off place and times, what they have plenty of, and when their needs were last updated. Any signed-in person can add one or edit it.
- **Needs** (shared, visible to everyone): item, category, how short (urgent or running low), an optional note, which food bank it belongs to, and when it was updated. Any signed-in person can add, edit or remove a need.
- **Follows**: which food banks a signed-in person follows. Private to that person.
- **Donation list entries**: which need someone has planned to give, when they added it, and when (if at all) they marked it as given. Private to the person who made it.

## Sample data
Start with six made-up food banks (such as Riverside Community Pantry, Northgate Food Bank, St Aldric's Church Larder, Hillcrest Family Food Hub, Brookside Student Pantry and Oakfield Food Bank) each with an area, drop-off details and a short list of what they have plenty of. Add around nineteen made-up needs spread across these food banks, covering categories like tins, drinks, toiletries, baby items and household goods, mostly marked urgent or running low, with a few notes (for example "long-life cartons only"). Give one sample signed-in person three food banks they follow and a donation list with one item still to take and two already given.

## Not yet
This first version won't include: maps or distance-based search, photos of items or food banks, an approval or moderation step before edits go live, email or push notifications about new needs, printing or exporting a shopping list, multiple separate donation lists per person, comments or messaging between people, or any link to real stock-management systems. These can come later once the basic idea is proven.
