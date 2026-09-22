"use client";

import { useMemo, useState } from "react";

export type CalendarHappening = {
  id: string;
  slug: string;
  title: string;
  type: "event" | "special";
  eyebrow?: string;
  summary?: string;
  details?: string;
  startsAt?: string;
  endsAt?: string;
  schedule?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  imageUrl?: string | null;
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function sameDay(value: string | undefined, year: number, month: number, day: number) {
  if (!value) return false;
  const date = new Date(value);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

function dateLabel(item: CalendarHappening) {
  if (item.schedule) return item.schedule;
  if (!item.startsAt) return item.type === "special" ? "Available now" : "Ongoing";
  const start = new Date(item.startsAt);
  const startLabel = start.toLocaleDateString("en-US", { month:"short", day:"numeric" });
  if (!item.endsAt) return startLabel;
  const end = new Date(item.endsAt);
  const endLabel = end.toLocaleDateString("en-US", { month:"short", day:"numeric" });
  return startLabel === endLabel ? startLabel : `${startLabel} — ${endLabel}`;
}

export default function HappeningsCalendar({ items, locationName }: { items: CalendarHappening[]; locationName: string }) {
  const firstDated = items.find((item) => item.startsAt);
  const initialDate = firstDated ? new Date(firstDated.startsAt as string) : new Date();
  const [month, setMonth] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingDays = new Date(year, monthIndex, 1).getDay();
  const cells = useMemo(() => [
    ...Array.from({ length: leadingDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ], [leadingDays, daysInMonth]);
  const today = new Date();
  const ongoing = items.filter((item) => !item.startsAt);

  return <section className="calendar-shell" aria-label={`Happenings calendar for Kitchen Master ${locationName}`}>
    <div className="calendar-toolbar">
      <div><small>{locationName.toUpperCase()}</small><h2>{month.toLocaleDateString("en-US", { month:"long", year:"numeric" })}</h2></div>
      <div className="calendar-controls">
        <button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}>←</button>
        <button type="button" onClick={() => { const current = new Date(); setMonth(new Date(current.getFullYear(), current.getMonth(), 1)); }}>Today</button>
        <button type="button" aria-label="Next month" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}>→</button>
      </div>
    </div>

    {ongoing.length > 0 && <div className="calendar-ongoing"><small>ONGOING</small>{ongoing.map((item) => <a href={`#happening-${item.slug}`} key={item.id}>{item.title}</a>)}</div>}

    <div className="calendar-weekdays" aria-hidden="true">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
    <div className="calendar-grid">
      {cells.map((day, index) => {
        if (day === null) return <div className="calendar-day calendar-day-blank" key={`blank-${index}`} />;
        const dayItems = items.filter((item) => sameDay(item.startsAt, year, monthIndex, day));
        const isToday = today.getFullYear() === year && today.getMonth() === monthIndex && today.getDate() === day;
        return <div className={`calendar-day${isToday ? " calendar-day-today" : ""}`} key={day}>
          <span className="calendar-date">{day}</span>
          <div>{dayItems.map((item) => <a className={`calendar-event calendar-event-${item.type}`} href={`#happening-${item.slug}`} key={item.id}>{item.title}</a>)}</div>
        </div>;
      })}
    </div>

    <div className="calendar-agenda" aria-label="Happening details">
      {items.length > 0 ? items.map((item) => <article id={`happening-${item.slug}`} key={item.id}>
        {item.imageUrl && <img src={item.imageUrl} alt="" />}
        <div>
          <div className="calendar-agenda-meta"><span>{item.eyebrow || item.type}</span><time>{dateLabel(item)}</time></div>
          <h3>{item.title}</h3>
          {item.summary && <p>{item.summary}</p>}
          {item.details && <p className="calendar-agenda-details">{item.details}</p>}
          {item.buttonUrl && <a className="under-link" href={item.buttonUrl}>{item.buttonLabel || "Learn more"} <span>→</span></a>}
        </div>
      </article>) : <div className="calendar-empty"><strong>No events are scheduled yet.</strong><span>New specials and events for {locationName} will appear here.</span></div>}
    </div>
  </section>;
}
