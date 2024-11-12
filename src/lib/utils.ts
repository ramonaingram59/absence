import bcrypt from "bcryptjs";
import { type ClassValue, clsx } from "clsx";
import { addHours, format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());

  const diffSeconds = Math.floor(diffTime / 1000);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffSeconds < 60) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  } else if (diffDays === 1) {
    return "1 day ago";
  } else {
    return `${diffDays} days ago`;
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

export const bcryptPasswordHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const bcryptComparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const formatDate = (date: Date | string | null) => {
  return date ? format(date, "eeee, dd MMM yyyy") : "-";
};

export const formatTime = (date: Date | string | null) => {
  return date ? format(date, "HH:mm") : "-";
};

export const formatOnlyDate = (date: Date | string | null) => {
  return date ? format(date, "yyyy-MM-dd") : "-";
};

export const formatDateWIB = (date: Date | string | null) => {
  const indonesianDate = addHours(date!, 7);

  return date ? format(indonesianDate, "eeee, dd MMM yyyy") : "-";
};

export const formatTimeWIB = (date: Date | string | null) => {
  const indonesianDate = addHours(date!, 7);

  return date ? format(indonesianDate, "HH:mm") : "-";
};

export const formatOnlyDateWIB = (date: Date | string | null) => {
  const indonesianDate = addHours(date!, 7);

  return date ? format(indonesianDate, "yyyy-MM-dd") : "-";
};
