// Made-up data for trying the prototype. Every food bank, place and item here is invented.

export const foodBanks = [
    {
        id: 'riverside',
        name: 'Riverside Community Pantry',
        area: 'Riverside',
        dropOffPlace: 'Side entrance of Riverside Community Centre',
        dropOffTimes: 'Monday, Wednesday and Friday, 10:00 to 14:00',
        updatedDaysAgo: 0,
        plenty: ['Pasta', 'Baked beans', 'Tinned soup'],
    },
    {
        id: 'northgate',
        name: 'Northgate Food Bank',
        area: 'Northgate',
        dropOffPlace: 'Hall behind Northgate Library',
        dropOffTimes: 'Tuesday and Thursday, 09:30 to 12:30',
        updatedDaysAgo: 1,
        plenty: ['Rice', 'Tea bags'],
    },
    {
        id: 'aldric',
        name: "St Aldric's Church Larder",
        area: 'Elm Park',
        dropOffPlace: "St Aldric's church hall, Elm Park",
        dropOffTimes: 'Saturday, 09:00 to 12:00',
        updatedDaysAgo: 3,
        plenty: ['Breakfast cereal', 'Tinned tomatoes', 'Biscuits'],
    },
    {
        id: 'hillcrest',
        name: 'Hillcrest Family Food Hub and Community Kitchen',
        area: 'Hillcrest',
        dropOffPlace: 'Hillcrest Family Centre reception',
        dropOffTimes: 'Monday to Friday, 08:30 to 16:00',
        updatedDaysAgo: 2,
        plenty: ['Pasta sauce'],
    },
    {
        id: 'brookside',
        name: 'Brookside Student Pantry',
        area: 'Brookside',
        dropOffPlace: 'Students’ union front desk, Brookside campus',
        dropOffTimes: 'Weekdays, 11:00 to 15:00',
        updatedDaysAgo: 6,
        plenty: ['Instant noodles', 'Porridge oats'],
    },
    {
        id: 'oakfield',
        name: 'Oakfield Food Bank',
        area: 'Oakfield',
        dropOffPlace: 'Oakfield Methodist hall',
        dropOffTimes: 'Wednesday, 13:00 to 17:00',
        updatedDaysAgo: 4,
        plenty: ['Most things: thank you to everyone who gave last month'],
    },
];

// level is 'urgent' (almost none left) or 'low' (running low)
export const needs = [
    { id: 1, bankId: 'riverside', item: 'UHT milk', category: 'Drinks', level: 'urgent', updatedDaysAgo: 0, note: 'Long-life cartons only, please.' },
    { id: 2, bankId: 'riverside', item: 'Tinned meat', category: 'Tins and jars', level: 'urgent', updatedDaysAgo: 0 },
    { id: 3, bankId: 'riverside', item: 'Toilet roll', category: 'Toiletries', level: 'low', updatedDaysAgo: 0 },
    { id: 4, bankId: 'riverside', item: 'Sugar (500g bags)', category: 'Dry food', level: 'low', updatedDaysAgo: 2 },
    { id: 5, bankId: 'northgate', item: 'Nappies (size 5 and 6)', category: 'Baby', level: 'urgent', updatedDaysAgo: 1 },
    { id: 6, bankId: 'northgate', item: 'Tinned fruit', category: 'Tins and jars', level: 'urgent', updatedDaysAgo: 1 },
    { id: 7, bankId: 'northgate', item: 'Coffee', category: 'Drinks', level: 'low', updatedDaysAgo: 1 },
    { id: 8, bankId: 'northgate', item: 'Shampoo', category: 'Toiletries', level: 'low', updatedDaysAgo: 3 },
    { id: 9, bankId: 'northgate', item: 'Washing-up liquid', category: 'Household', level: 'low', updatedDaysAgo: 3 },
    { id: 10, bankId: 'aldric', item: 'Tinned potatoes', category: 'Tins and jars', level: 'urgent', updatedDaysAgo: 3 },
    { id: 11, bankId: 'aldric', item: 'Long-life fruit juice', category: 'Drinks', level: 'low', updatedDaysAgo: 3 },
    { id: 12, bankId: 'aldric', item: 'Deodorant', category: 'Toiletries', level: 'low', updatedDaysAgo: 5 },
    { id: 13, bankId: 'hillcrest', item: 'Baby wipes', category: 'Baby', level: 'urgent', updatedDaysAgo: 2 },
    { id: 14, bankId: 'hillcrest', item: 'Lunchbox snacks (cereal bars, raisins)', category: 'Breakfast and snacks', level: 'urgent', updatedDaysAgo: 2, note: 'For school holidays. No nuts, please.' },
    { id: 15, bankId: 'hillcrest', item: 'Sanitary towels', category: 'Toiletries', level: 'urgent', updatedDaysAgo: 2 },
    { id: 16, bankId: 'hillcrest', item: 'Laundry pods', category: 'Household', level: 'low', updatedDaysAgo: 4 },
    { id: 17, bankId: 'brookside', item: 'Cooking oil', category: 'Dry food', level: 'urgent', updatedDaysAgo: 6 },
    { id: 18, bankId: 'brookside', item: 'Tinned chickpeas and lentils', category: 'Tins and jars', level: 'low', updatedDaysAgo: 6 },
    { id: 19, bankId: 'brookside', item: 'Toothpaste', category: 'Toiletries', level: 'low', updatedDaysAgo: 6 },
];

export const categories = ['Tins and jars', 'Dry food', 'Breakfast and snacks', 'Drinks', 'Baby', 'Toiletries', 'Household'];

export const initialFollowing = ['riverside', 'northgate', 'aldric'];

function daysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return date.toISOString();
}

// A starting donation list: one thing still to take, and two already given.
export const initialPlan = [
    { id: 'p1', needId: 1, plannedOn: daysAgo(0), givenOn: null },
    { id: 'p2', needId: 10, plannedOn: daysAgo(10), givenOn: daysAgo(8) },
    { id: 'p3', needId: 12, plannedOn: daysAgo(10), givenOn: daysAgo(8) },
];
