import { Database } from "@/types/supabase";
import React from "react";

export type INewUser = {
  name: string;
  email: string;
  departement: string;
  password: string;
};

export type IContextType = {
  user: User;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type IUser = {
  id: string;
  name: string;
  departement: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
  role: string
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type User = Database["public"]["Tables"]["Users"]["Row"];
export type FaceData = Database["public"]["Tables"]["FaceData"]["Row"];
export type AttendanceRecord =
  Database["public"]["Tables"]["AttendanceRecord"]["Row"];
export type Departement = Database["public"]["Tables"]["Departement"]["Row"];
export type RoomEntryRecord =
  Database["public"]["Tables"]["RoomEntryRecord"]["Row"];
export type UnknownFaceRecord =
  Database["public"]["Tables"]["UnknownFaceRecord"]["Row"];

export enum ROLE {
  ADMIN = "admin",
  USER = "user",
}
