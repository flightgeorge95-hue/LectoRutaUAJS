import { AchievementsPage } from "@/components/gamification/achievements-page"

export default function Achievements() {
  // Mock student data - in real app would come from authentication
  const mockStudent = {
    id: "1",
    name: "María González",
    grade: 8,
    points: 1250,
    level: 5,
    streak: 7,
    totalWorkshops: 23,
  }

  return <AchievementsPage student={mockStudent} />
}
