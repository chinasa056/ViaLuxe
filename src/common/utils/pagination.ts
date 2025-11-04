
export function buildPagination(page = 1, pageSize = 10) {
const skip = (page - 1) * pageSize;
const take = pageSize;
return { skip, take };
}