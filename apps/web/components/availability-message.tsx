"use client";

import * as React from "react";

import styles from "./availability-message.module.css";

const TBILISI_TIME_ZONE = "Asia/Tbilisi";
const WORKDAY_START_HOUR = 11;
const WORKDAY_END_HOUR = 20;

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TBILISI_TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

interface TimeParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function getTbilisiTime(date: Date): TimeParts {
  const parts = Object.fromEntries(
    partsFormatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );

  return parts as unknown as TimeParts;
}

function getTbilisiOffsetMinutes(date: Date, parts: TimeParts) {
  const tbilisiAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return Math.round((tbilisiAsUtc - date.getTime()) / 60_000);
}

function formatOffset(hours: number) {
  const absoluteHours = Math.abs(hours);
  const numberWords = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
  ];
  const value = Number.isInteger(absoluteHours)
    ? (numberWords[absoluteHours] ?? String(absoluteHours))
    : absoluteHours.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  const unit = absoluteHours === 1 ? "hour" : "hours";
  const direction = hours > 0 ? "ahead of" : "behind";

  return `${value} ${unit} ${direction} you`;
}

function formatHour(hour: number) {
  return `${hour % 12 || 12} ${hour < 12 ? "am" : "pm"}`;
}

function Clock({ hour, minute }: { hour: number; minute: number }) {
  return (
    <span
      className={styles.clock}
      style={
        {
          "--hour-angle": `${(hour % 12) * 30 + minute * 0.5}deg`,
          "--minute-angle": `${minute * 6}deg`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <span className={styles.hourHand} />
      <span className={styles.minuteHand} />
    </span>
  );
}

export function AvailabilityMessage() {
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const updateTime = () => setNow(new Date());

    updateTime();
    const interval = window.setInterval(updateTime, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  if (!now) return <>I&apos;ll return to you in an hour.</>;

  const tbilisi = getTbilisiTime(now);
  const isWorking =
    tbilisi.hour >= WORKDAY_START_HOUR && tbilisi.hour < WORKDAY_END_HOUR;

  const visitorOffsetMinutes = -now.getTimezoneOffset();
  const offsetHours =
    (getTbilisiOffsetMinutes(now, tbilisi) - visitorOffsetMinutes) / 60;

  const message = (
    <>
      <Clock hour={tbilisi.hour} minute={tbilisi.minute} />It&apos;s{" "}
      {formatHour(tbilisi.hour)} here
      {offsetHours === 0 ? (
        <>, and we&apos;re in the same time zone. </>
      ) : (
        <>, so I&apos;m {formatOffset(offsetHours)}. </>
      )}
      {isWorking ? (
        <>I&apos;ll reply in about an hour.</>
      ) : (
        <>
          I&apos;m probably already in bed, but I&apos;ll reply first thing tomorrow.
        </>
      )}
    </>
  );

  return <span className={styles.message}>{message}</span>;
}
