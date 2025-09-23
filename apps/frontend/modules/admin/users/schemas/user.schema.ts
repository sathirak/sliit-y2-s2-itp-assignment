import { z } from "zod";

// User roles enum for validation
export const UserRole = z.enum(["customer", "owner", "sales_rep", "supplier"]);

// Create user form schema
export const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  roleName: UserRole,
});

// Edit user form schema (allows partial updates)
export const editUserSchema = createUserSchema.partial();

// Types for form data
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;
