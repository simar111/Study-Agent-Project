const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters"
    ),
});

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters"
    ),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};