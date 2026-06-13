import { z } from "zod"

export const inviteMemberSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
})

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>
