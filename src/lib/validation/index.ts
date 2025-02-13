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
  userId: z.string().min(4, { message: 'Please select user.' }),
})


export const ProfileValidation = z.object({
  name: z.string().min(3, { message: 'Name must be at least 2 characters' }),
  departement: z.string().min(2, { message: 'Departement must be at least 2 characters' }),
  email: z.string().email({ message: "Please provide valid email type" }),
  position: z.string({ message: 'Position is required.' }).min(3, { message: 'Position must be at least 2 characters' }),
  NIK: z.number({ message: 'NIK is required.' }),
  status: z.string({ message: 'Status is required.' }).min(3, { message: 'Status must be at least 2 characters' }),
  role: z.string().min(3, { message: 'Role must be at least 2 characters' }),
})

export const MahasiswaValidation = z.object({
  name: z.string().min(3, { message: 'Name must be at least 2 characters' }),
  NIM: z.string().min(3, { message: 'NIM must be at least 2 characters' }),
})
