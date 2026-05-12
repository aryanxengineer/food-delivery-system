export const allowedRoles = ["customer", "rider", "seller"] as const;
export type Role = (typeof allowedRoles)[number];