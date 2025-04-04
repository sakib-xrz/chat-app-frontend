import * as Yup from "yup";

export const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm new password is required"),
});

export const createRoomSchema = Yup.object({
  name: Yup.string()
    .min(3, "Room name must be at least 3 characters")
    .max(30, "Room name must be less than 30 characters")
    .required("Room name is required"),
  description: Yup.string().max(
    100,
    "Description must be less than 100 characters"
  ),
});

export const messageSchema = Yup.object({
  content: Yup.string().required("Message cannot be empty"),
});
