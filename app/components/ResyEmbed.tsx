"use client";

import { useMemo, useState } from "react";

const DEFAULT_RESERVATION_URL = "https://resy.com/cities/suwanee-ga/venues/kitchen-master-suwanee";

function isoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function serviceTimes(date: Date) {
  const day = date.getDay();
  if (day === 1) return [];
  if (day === 5 || day === 6) return ["5:00 PM", "6:30 PM", "8:00 PM", "9:00 PM"];
  return ["5:00 PM", "6:30 PM", "8:00 PM"];
}

function resyTime(time: string) {
  const [clock, period] = time.split(" ");
  const [rawHours, minutes] = clock.split(":").map(Number);
  let hours = rawHours;
  if (period === "PM" && hours !== 12) hours += 12;
  return `${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}`;
}

type ReservationContent = { eyebrow?: string; title?: string; accent?: string; description?: string };

export default function ResyEmbed({ locationName = "Suwanee", reservationUrl = DEFAULT_RESERVATION_URL, phone, content }: { locationName?: string; reservationUrl?: string; phone?: string; content?: ReservationContent }) {
  const dates = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return date;
  }), []);
  const firstOpenDate = dates.find((date) => serviceTimes(date).length) ?? dates[0];
  const [selectedDate, setSelectedDate] = useState(isoDate(firstOpenDate));
  const [partySize, setPartySize] = useState(2);
  const [selectedTime, setSelectedTime] = useState(serviceTimes(firstOpenDate)[0] ?? "5:00 PM");
  const isResy = reservationUrl.includes("resy.com");
  const resyUrl = `${reservationUrl.split("?")[0]}?date=${selectedDate}&seats=${partySize}&time=${resyTime(selectedTime)}`;
  const interpolate = (value: string) => value.replaceAll("{{location}}", locationName);
  const eyebrow = interpolate(content?.eyebrow || "Reservations");
  const title = interpolate(content?.title || "Your table in");
  const accent = interpolate(content?.accent || `${locationName}.`);
  const description = content?.description ? interpolate(content.description) : undefined;

  if (!isResy) {
    const isPhone = reservationUrl.startsWith("tel:");
    return <div className="resy-embed custom-reservation simple-reservation">
      <div className="reservation-copy">
        <p className="kicker">{eyebrow}</p>
        <h2>{title}<br /><em>{accent}</em></h2>
        <p>{description || (isPhone ? `Call the ${locationName} team and we’ll help arrange your table.` : "Choose your preferred date and party size on our secure reservation page.")}</p>
      </div>
      <div className="simple-reservation-action">
        <small>{isPhone ? "RESERVE BY PHONE" : "ONLINE RESERVATIONS"}</small>
        {phone && <strong>{phone}</strong>}
        <a className="button button-red" href={reservationUrl} target={isPhone ? undefined : "_blank"} rel={isPhone ? undefined : "noreferrer"}>{isPhone ? "Call to reserve" : "View reservations"} <span>{isPhone ? "→" : "↗"}</span></a>
      </div>
    </div>;
  }

  return (
    <div className="resy-embed custom-reservation">
      <div className="reservation-copy">
        <p className="kicker">{eyebrow}</p>
        <h2>{title}<br /><em>{accent}</em></h2>
        <p>{description || "Choose a date and party size here, then view live times and complete your reservation securely with Resy."}</p>
      </div>
      <div className="reservation-picker">
        <div className="party-picker">
          <span>PARTY SIZE</span>
          <div><button type="button" onClick={() => setPartySize((size) => Math.max(1, size - 1))} aria-label="Remove one guest">−</button><strong>{partySize} {partySize === 1 ? "guest" : "guests"}</strong><button type="button" onClick={() => setPartySize((size) => Math.min(20, size + 1))} aria-label="Add one guest">+</button></div>
        </div>
        <div className="reservation-dates" aria-label="Reservation dates and preferred times">
          {dates.map((date) => {
            const value = isoDate(date);
            const times = serviceTimes(date);
            return <div className={selectedDate === value ? "reservation-day active" : "reservation-day"} key={value}>
              <button className="reservation-day-head" type="button" onClick={() => { setSelectedDate(value); if (times.length) setSelectedTime(times[0]); }}><small>{date.toLocaleDateString("en-US", { weekday: "long" })}</small><strong>{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong></button>
              <div className="reservation-times">{times.length ? times.map((time) => <button type="button" className={selectedDate === value && selectedTime === time ? "active" : ""} onClick={() => { setSelectedDate(value); setSelectedTime(time); }} key={time}>{time}</button>) : <span>Closed</span>}</div>
            </div>;
          })}
        </div>
        <div className="reservation-submit"><div><small>SELECTED</small><strong>{new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} · {selectedTime} · {partySize} {partySize === 1 ? "guest" : "guests"}</strong></div><a className="button button-red" href={resyUrl} target="_blank" rel="noreferrer">Continue on Resy <span>↗</span></a></div>
        <p className="resy-note">Preferred times shown · Resy confirms live availability and completes the booking.</p>
      </div>
    </div>
  );
}
