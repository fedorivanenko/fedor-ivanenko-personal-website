"use client";

import * as React from "react";

const TBILISI_TIME_ZONE = "Asia/Tbilisi";

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TBILISI_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function getTbilisiHour(date: Date) {
  const hour = timeFormatter
    .formatToParts(date)
    .find((part) => part.type === "hour")?.value;

  return Number(hour);
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

  const hour = getTbilisiHour(now);
  const isSleeping = hour >= 20 || hour < 11;

  if (!isSleeping) return <>I&apos;ll return to you in an hour.</>;

  return (
    <>
      Currently I&apos;m in bed ({timeFormatter.format(now)}), will answer you
      first thing tomorrow.
    </>
  );
}
