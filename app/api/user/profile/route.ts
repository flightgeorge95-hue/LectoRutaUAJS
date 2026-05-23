import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "No session found" }, { status: 401 })
    }

    const db = new Database()
    const session = await db.getSession(sessionToken)

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const user = await db.findUserById(session.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get student-specific data if user is a student
    let studentData = null
    if (user.userType === "student") {
      studentData = await db.findStudentByUserId(user._id.toString())
    }

    const profileData = {
      id: user._id.toString(),
      email: user.email,
      userType: user.userType,
      firstName: studentData?.firstName || user.email.split("@")[0],
      lastName: studentData?.lastName || "",
      grade: studentData?.grade || "11",
      documentNumber: studentData?.documentNumber || "",
      documentType: studentData?.documentType || "CC",
      phoneNumber: studentData?.phoneNumber || "",
      birthDate: studentData?.birthDate || "",
      // Add some default progress data
      points: 1250,
      level: 8,
      streak: 12,
      completedWorkshops: 15,
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
