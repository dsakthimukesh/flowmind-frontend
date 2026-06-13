import { AppProviders } from "@/app/providers/AppProviders"
import { AppRouter } from "@/app/router"
import "@/styles/globals.css"

export const App = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
