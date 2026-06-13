import { type ReactNode } from "react"
import { type Role } from "@/types/auth"

export interface RouteConfig {
  path: string
  element: ReactNode
  roles?: Role[]
  children?: RouteConfig[]
}
