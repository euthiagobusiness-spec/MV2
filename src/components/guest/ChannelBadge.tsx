const labels: Record<string, string> = {
  airbnb: "Airbnb",
  booking: "Booking",
  expedia: "Expedia",
  decolar: "Decolar",
  direct: "Site proprio",
  stays: "Stays",
  other: "Outro",
};

export function ChannelBadge({ channel }: { channel: string }) {
  return (
    <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-900">
      {labels[channel] ?? channel}
    </span>
  );
}
