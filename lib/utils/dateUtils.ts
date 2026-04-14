export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDayOfWeek(): string {
  const days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return days[new Date().getDay()];
}

export function formatDateDisplay(dateKey: string): { month: string; day: string; year: string; weekday: string } {
  const [year, month, day] = dateKey.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return {
    month,
    day,
    year,
    weekday: `星期${weekdays[date.getDay()]}`,
  };
}

export function getDaysSinceStart(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date(getTodayKey());
  const diff = today.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

export function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
