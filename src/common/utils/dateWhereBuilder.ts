import { Status } from '@prisma/client';


export function buildDateWhere(status?: Status, startDate?: Date, endDate?: Date): any {
if (!startDate || !endDate) return {};
const dateRangeCondition = { gte: startDate, lte: endDate };


if (!status) {
return {
OR: [
{ status: { not: Status.DRAFT }, datePublished: { ...dateRangeCondition, not: null } },
{ status: Status.DRAFT, createdAt: dateRangeCondition },
],
};
} else if (status === Status.DRAFT) {
return { createdAt: dateRangeCondition };
} else {
return { datePublished: { ...dateRangeCondition, not: null } };
}
}