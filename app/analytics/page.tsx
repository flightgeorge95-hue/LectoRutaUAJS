import { ProgressAnalytics } from "@/components/analytics/progress-analytics"

export default function AnalyticsPage() {
  // Mock user data - in real app would come from authentication
  const mockUser = {
    id: "1",
    name: "María González",
    grade: 8,
    type: "student" as const,
  }

  return <ProgressAnalytics user={mockUser} />
}
