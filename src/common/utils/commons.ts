
export function calculateDuration(departure: Date, ret: Date): number {
const ms = ret.getTime() - departure.getTime();
const days = Math.floor(ms / (1000 * 60 * 60 * 24));
return days >= 0 ? days : 0;
}