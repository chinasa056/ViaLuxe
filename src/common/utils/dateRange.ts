 export function dateRangePresetToDates(preset?: string, start?: Date, end?: Date) {
    if (preset === 'custom') return { startDate: start, endDate: end };
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());


    switch (preset) {
    case 'today':
    return { startDate: todayStart, endDate: new Date() };
    case 'last_7_days': {
    const s = new Date(todayStart);
    s.setDate(s.getDate() - 7);
    return { startDate: s, endDate: new Date() };
    }
    case 'last_14_days': {
    const s = new Date(todayStart);
    s.setDate(s.getDate() - 14);
    return { startDate: s, endDate: new Date() };
    }
    case 'month_to_date':
    return { startDate: new Date(todayStart.getFullYear(), todayStart.getMonth(), 1), endDate: new Date() };
    case 'last_3_months':
    return { startDate: new Date(todayStart.getFullYear(), todayStart.getMonth() - 3, todayStart.getDate()), endDate: new Date() };
    case 'last_12_months':
    return { startDate: new Date(todayStart.getFullYear(), todayStart.getMonth() - 12, todayStart.getDate()), endDate: new Date() };
    case 'year_to_date':
    return { startDate: new Date(todayStart.getFullYear(), 0, 1), endDate: new Date() };
    default:
    return { startDate: undefined, endDate: undefined };
    }
    }