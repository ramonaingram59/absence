import { ROLE } from "@/types";

export const SIDEBAR_LINKS = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
    role: ROLE.USER
  },
  {
    imgURL: "/assets/icons/face-scan.svg",
    route: "/scan",
    label: "Scan",
    role: ROLE.ADMIN
  },
  {
    imgURL: "/assets/icons/log.svg",
    route: "/history",
    label: "History",
    role: ROLE.USER
  },
  {
    imgURL: "/assets/icons/settings.svg",
    route: "/settings",
    label: "Settings",
    role: ROLE.USER
  },
];

export const BOTTOMBAR_LINKS = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
    role: ROLE.USER
  },
  {
    imgURL: "/assets/icons/face-scan.svg",
    route: "/scan",
    label: "Scan",
    role: ROLE.ADMIN
  },
  {
    imgURL: "/assets/icons/log.svg",
    route: "/history",
    label: "History",
    role: ROLE.USER
  },
  {
    imgURL: "/assets/icons/settings.svg",
    route: "/settings",
    label: "Settings",
    role: ROLE.USER
  },
];