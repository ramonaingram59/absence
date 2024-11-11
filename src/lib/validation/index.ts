import * as z from "zod";

export const SignupValidation = z.object({
  name: z.string().min(3, { message: 'Name must be at least 2 characters' }),
  departement: z.string().min(3, { message: 'Departement must be at least 2 characters' }),
  email: z.string().email({ message: "Please provide valid email type" }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})

export const SigninValidation = z.object({
  email: z.string().email({ message: "Please provide valid email type" }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})

export const PostValidation = z.object({
  caption: z.string().min(5).max(2200, { message: 'Caption is too long.' }),
  file: z.custom<File[]>(),
  location: z.string().min(5).max(200, { message: 'Location is too long.' }),
  tags: z.string().min(5).max(200, { message: 'Tags is too long.' }),
})


export const RegisterFileUpload = z.object({
  file: z.custom<File[]>(),
  fullName: z.string().min(4, { message: 'Full Name is too short.' }).max(100, { message: 'Name is too long.' }),
})


export const ProfileValidation = z.object({
  name: z.string().min(3, { message: 'Name must be at least 2 characters' }),
  departement: z.string().min(3, { message: 'Departement must be at least 2 characters' }),
  email: z.string().email({ message: "Please provide valid email type" }),
  position: z.string({ message: 'Position must be at least 2 characters' }).min(3, { message: 'Position must be at least 2 characters' }),
  NIK: z.number({ message: 'NIK must be at least 2 characters' }).min(3, { message: 'NIK must be at least 2 characters' }),
  status: z.string({ message: 'Status must be at least 2 characters' }).min(3, { message: 'Status must be at least 2 characters' }),
  role: z.string({ message: 'Role must be at least 2 characters' }).min(3, { message: 'Role must be at least 2 characters' }),
})
