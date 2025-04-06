import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatMessengerTime(timestamp) {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diff = now - messageTime;

  // Time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "Just now";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diff < 2 * hour) {
    return "1 hour ago";
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diff < 2 * day) {
    return "Yesterday";
  } else {
    const options = { month: "short", day: "numeric" };
    return messageTime.toLocaleDateString("en-US", options);
  }
}
