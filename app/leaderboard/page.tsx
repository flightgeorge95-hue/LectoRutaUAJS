import { LeaderboardPage } from "@/components/gamification/leaderboard-page"

export default function Leaderboard() {
  // Mock student data
  const mockStudent = {
    id: "1",
    name: "María González",
    grade: 8,
    points: 1250,
    level: 5,
  }

  return <LeaderboardPage currentStudent={mockStudent} />
}
