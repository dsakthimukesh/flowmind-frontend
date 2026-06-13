import { PageContainer } from "@/components/common/PageContainer"
import { PageHeader } from "@/components/common/PageHeader"

export const SettingsPage = () => {
  return (
    <PageContainer>
      <PageHeader title="Settings" description="Adjust settings for your workspace and personal account." />
      <div className="flex items-center justify-center min-h-[300px] border border-dashed border-border rounded-xl bg-card">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Coming Soon</h2>
          <p className="text-sm text-muted-foreground">The Settings configure panel is currently under development.</p>
        </div>
      </div>
    </PageContainer>
  )
}
