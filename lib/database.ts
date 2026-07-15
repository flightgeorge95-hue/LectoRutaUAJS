import mongoose from "mongoose"
import bcrypt from "bcryptjs"

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lectosaber"

// Nunca imprimir MONGODB_URI: contiene credenciales y quedaría expuesta en los logs del servidor

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  userType: { type: String, enum: ["student", "teacher", "admin"], required: true },
  createdAt: { type: Date, default: Date.now },
})

// Workshop Schema
const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true }, // "Lectura Crítica", "Matemáticas", etc.
  grade: { type: Number, required: true, enum: [10, 11] }, // Solo grados 10 y 11
  difficulty: { type: String, enum: ["Básico", "Intermedio", "Avanzado"], default: "Intermedio" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  isActive: { type: Boolean, default: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Estudiantes asignados
  dueDate: { type: Date, default: null }, // Fecha límite de entrega (opcional)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Question Schema
const questionSchema = new mongoose.Schema({
  workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
  questionNumber: { type: Number, required: true },
  questionType: { type: String, enum: ["multiple_choice", "open_ended"], default: "multiple_choice" },
  competence: {
    type: String,
    enum: [
      "Identificar y entender contenidos locales",
      "Comprender articulación del texto",
      "Reflexionar y evaluar críticamente",
    ],
    required: true,
  },
  textType: { type: String, required: true }, // "Continuo informativo", "Discontinuo", etc.
  referenceText: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [
    {
      letter: { type: String }, // A, B, C, D (only for multiple choice)
      text: { type: String },
    },
  ],
  correctAnswer: { type: String }, // A, B, C, or D for multiple choice; text for open-ended
  explanation: { type: String, required: true },
  hint: { type: String },
  difficulty: { type: String, enum: ["Fácil", "Media", "Difícil"], default: "Media" },
  category: { type: String }, // Categoría adicional definida por el docente
  createdAt: { type: Date, default: Date.now },
})

// Student Progress Schema
const studentProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  selectedAnswer: { type: String, required: true }, // letter for MC, text for open
  openAnswer: { type: String },                      // respuesta de texto libre (preguntas abiertas)
  isCorrect: { type: Boolean, required: true },       // false por defecto para abiertas hasta calificar
  teacherGrade: { type: Number, min: 0, max: 10 },   // nota del docente 0-10 para preguntas abiertas
  teacherFeedback: { type: String },                  // retroalimentación escrita del docente
  gradedAt: { type: Date },
  attemptedAt: { type: Date, default: Date.now },
  timeSpent: { type: Number },
})

// Workshop Completion Schema
const workshopCompletionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
  score: { type: Number, required: true },            // % respuestas correctas (solo opción múltiple)
  questionsAnswered: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  openQuestionsCount: { type: Number, default: 0 },   // cuántas preguntas abiertas tiene
  // 'auto_graded': solo opción múltiple, nota inmediata
  // 'pending_review': tiene preguntas abiertas, docente debe calificar
  // 'reviewed': docente ya calificó todas las abiertas
  status: { type: String, enum: ["auto_graded", "pending_review", "reviewed"], default: "auto_graded" },
  finalGrade: { type: Number, min: 0, max: 5 },       // nota final en escala colombiana 0.0–5.0
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  gradedAt: { type: Date },
  timeSpent: { type: Number },
  completedAt: { type: Date, default: Date.now },
})

// Student Schema
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  grade: { type: Number, required: true, enum: [10, 11] }, // Solo grados 10 y 11
  tarjetaIdentidad: { type: String, required: true, unique: true }, // Tarjeta de Identidad (login)
  password: { type: String, required: true }, // Password para login
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  birthDate: { type: Date, required: true },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  userType: { type: String, default: "student" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  cedula: { type: String, required: true, unique: true }, // Cédula (login)
  password: { type: String, required: true }, // Password para login
  email: { type: String, required: true },
  institution: { type: String, required: true },
  subject: { type: String, required: true },
  userType: { type: String, default: "teacher" },
  gradesTeaching: [{ type: Number, enum: [10, 11] }], // Grados que enseña
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Session Schema
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionToken: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

// Login Attempt Schema
const loginAttemptSchema = new mongoose.Schema({
  email: { type: String, required: true },
  success: { type: Boolean, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  attemptedAt: { type: Date, default: Date.now },
})

// Resource Schema (Biblioteca ICFES - Publicaciones de docentes)
const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["tip", "video", "guide", "image"], required: true },
  category: { type: String, enum: [
    "Lectura Crítica",
    "Estrategias ICFES",
    "Comprensión Lectora",
    "Tips de Estudio",
    "Motivación",
    "General"
  ], default: "General" },
  videoUrl: { type: String },
  imageUrl: { type: String },
  pdfUrl: { type: String },
  targetGrades: [{ type: Number, enum: [10, 11] }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Admin Schema
const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  userType: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
})

// Create Models
const User = mongoose.models.User || mongoose.model("User", userSchema)
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema)
const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema)
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema)
const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema)
const LoginAttempt = mongoose.models.LoginAttempt || mongoose.model("LoginAttempt", loginAttemptSchema)
const Workshop = mongoose.models.Workshop || mongoose.model("Workshop", workshopSchema)
const Question = mongoose.models.Question || mongoose.model("Question", questionSchema)
const StudentProgress = mongoose.models.StudentProgress || mongoose.model("StudentProgress", studentProgressSchema)
const WorkshopCompletion =
  mongoose.models.WorkshopCompletion || mongoose.model("WorkshopCompletion", workshopCompletionSchema)
const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema)

export class Database {
  static async connect() {
    try {
      // Si ya está conectado, no hacer nada
      if (mongoose.connection.readyState === 1) {
        console.log("✅ [DATABASE] Ya conectado a MongoDB")
        return true
      }

      if (mongoose.connection.readyState === 0) {
        console.log("🔄 [DATABASE] Conectando a MongoDB...")
        console.log("⏳ [DATABASE] Este proceso puede tardar unos segundos...")
        await mongoose.connect(MONGODB_URI)
        console.log("✅ [DATABASE] ¡Conexión exitosa a MongoDB!")
        console.log(`📊 [DATABASE] Base de datos: ${mongoose.connection.db.databaseName}`)
        console.log("═══════════════════════════════════════════════════════════\n")
      }
      return true
    } catch (error) {
      console.error("═══════════════════════════════════════════════════════════")
      console.error("❌ [DATABASE] ERROR DE CONEXIÓN A MONGODB")
      console.error("═══════════════════════════════════════════════════════════")
      console.error("📋 Detalles del error:", error.message)
      console.error("\n💡 [DATABASE] SOLUCIONES POSIBLES:")
      console.error("   1. Verificar que MongoDB esté corriendo:")
      console.error("      Windows: net start MongoDB")
      console.error("      macOS:   brew services start mongodb-community@6.0")
      console.error("      Linux:   sudo systemctl start mongod")
      console.error("\n   2. Verificar que la URI sea correcta en .env.local:")
      console.error(`      Actual: ${MONGODB_URI}`)
      console.error("\n   3. Verificar que el puerto 27017 esté libre")
      console.error("\n   4. Revisar el manual: MANUAL_USUARIO.md")
      console.error("═══════════════════════════════════════════════════════════\n")
      return false
    }
  }

  static async testConnection() {
    try {
      console.log("🧪 [DATABASE] Realizando test de conexión...")
      await this.connect()
      const isConnected = mongoose.connection.readyState === 1
      if (isConnected) {
        console.log("✅ [DATABASE] Test de conexión exitoso")
        console.log(`📊 [DATABASE] Colecciones disponibles: ${Object.keys(mongoose.connection.collections).length}`)
      } else {
        console.log("⚠️  [DATABASE] Test de conexión falló")
      }
      return isConnected
    } catch (error) {
      console.error("❌ [DATABASE] Test de conexión falló:", error.message)
      return false
    }
  }

  static async findUserByEmail(email: string) {
    try {
      await this.connect()
      const user = await User.findOne({ email }).lean()
      return user
    } catch (error) {
      console.error("Database error finding user:", error)
      return null
    }
  }

  static async getStudentDetails(userId: string) {
    try {
      await this.connect()
      const student = await Student.findOne({ userId }).lean()
      return student
    } catch (error) {
      console.error("Database error getting student details:", error)
      return null
    }
  }

  static async getTeacherDetails(userId: string) {
    try {
      await this.connect()
      const teacher = await Teacher.findOne({ userId }).lean()
      return teacher
    } catch (error) {
      console.error("Database error getting teacher details:", error)
      return null
    }
  }

  static async createSession(
    userId: string,
    sessionToken: string,
    expiresAt: Date,
    ipAddress: string,
    userAgent: string,
  ) {
    try {
      await this.connect()
      await Session.create({
        userId,
        sessionToken,
        expiresAt,
        ipAddress,
        userAgent,
      })
      return true
    } catch (error) {
      console.error("Database error creating session:", error)
      return false
    }
  }

  static async logLoginAttempt(email: string, success: boolean, ipAddress: string, userAgent: string) {
    try {
      await this.connect()
      await LoginAttempt.create({
        email,
        success,
        ipAddress,
        userAgent,
      })
      return true
    } catch (error) {
      console.error("Database error logging login attempt:", error)
      return false
    }
  }

  static async registerStudent(userData: {
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    grade: number
    tarjetaIdentidad: string
    phoneNumber: string
    birthDate: string
  }) {
    try {
      await this.connect()

      const user = await User.create({
        email: userData.email,
        passwordHash: userData.passwordHash,
        userType: "student",
      })

      await Student.create({
        userId: user._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        grade: userData.grade,
        tarjetaIdentidad: userData.tarjetaIdentidad,
        phoneNumber: userData.phoneNumber,
        birthDate: new Date(userData.birthDate),
        points: 0,
        level: 1,
      })

      return user._id.toString()
    } catch (error) {
      console.error("Database error registering student:", error)
      throw error
    }
  }

  static async emailExists(email: string): Promise<boolean> {
    try {
      await this.connect()
      const user = await User.findOne({ email }).lean()
      return !!user
    } catch (error) {
      console.error("Database error checking email:", error)
      throw error
    }
  }

  static async findStudentByTarjeta(tarjetaIdentidad: string) {
    try {
      await this.connect()
      const student = await Student.findOne({ tarjetaIdentidad }).lean()
      return student
    } catch (error) {
      console.error("Database error finding student:", error)
      return null
    }
  }

  static async findTeacherByCedula(cedula: string) {
    try {
      await this.connect()
      const teacher = await Teacher.findOne({ cedula }).lean()
      return teacher
    } catch (error) {
      console.error("Database error finding teacher:", error)
      return null
    }
  }

  static async verifyStudentPassword(tarjetaIdentidad: string, password: string) {
    try {
      const student = await this.findStudentByTarjeta(tarjetaIdentidad)
      if (!student) return null

      const isValid = await bcrypt.compare(password, student.password)
      return isValid ? student : null
    } catch (error) {
      console.error("Error verifying student password:", error)
      return null
    }
  }

  static async verifyTeacherPassword(cedula: string, password: string) {
    try {
      const teacher = await this.findTeacherByCedula(cedula)
      if (!teacher) return null

      const isValid = await bcrypt.compare(password, teacher.password)
      return isValid ? teacher : null
    } catch (error) {
      console.error("Error verifying teacher password:", error)
      return null
    }
  }

  static async createWorkshop(workshopData: {
    title: string
    description: string
    subject: string
    grade: number
    difficulty: string
    createdBy: string
    dueDate?: Date | null
  }) {
    try {
      await this.connect()
      const workshop = await Workshop.create(workshopData)
      return workshop
    } catch (error) {
      console.error("Database error creating workshop:", error)
      throw error
    }
  }

  static async getWorkshopsByGrade(grade: number) {
    try {
      await this.connect()
      const workshops = await Workshop.find({ grade, isActive: true }).populate("createdBy").lean()
      return workshops
    } catch (error) {
      console.error("Database error getting workshops:", error)
      return []
    }
  }

  static async getAllWorkshops() {
    try {
      await this.connect()
      const workshops = await Workshop.find({ isActive: true }).populate("createdBy").lean()
      return workshops
    } catch (error) {
      console.error("Database error getting all workshops:", error)
      return []
    }
  }

  static async createQuestion(questionData: any) {
    try {
      await this.connect()
      const question = await Question.create(questionData)
      return question
    } catch (error) {
      console.error("Database error creating question:", error)
      throw error
    }
  }

  static async createQuestionsFromJSON(workshopId: string, questionsArray: any[]) {
    try {
      await this.connect()
      const questions = questionsArray.map((q, index) => ({
        workshopId,
        questionNumber: index + 1,
        ...q,
      }))
      const created = await Question.insertMany(questions)
      return created
    } catch (error) {
      console.error("Database error importing questions:", error)
      throw error
    }
  }

  static async getQuestionsByWorkshop(workshopId: string) {
    try {
      await this.connect()
      const questions = await Question.find({ workshopId }).sort({ questionNumber: 1 }).lean()
      return questions
    } catch (error) {
      console.error("Database error getting questions:", error)
      return []
    }
  }

  static async updateQuestion(questionId: string, updateData: any) {
    try {
      await this.connect()
      const question = await Question.findByIdAndUpdate(questionId, updateData, { new: true })
      return question
    } catch (error) {
      console.error("Database error updating question:", error)
      throw error
    }
  }

  static async deleteQuestion(questionId: string) {
    try {
      await this.connect()
      await Question.findByIdAndDelete(questionId)
      return true
    } catch (error) {
      console.error("Database error deleting question:", error)
      throw error
    }
  }

  static async recordStudentAnswer(answerData: {
    studentId: string
    workshopId: string
    questionId: string
    selectedAnswer: string
    openAnswer?: string
    isCorrect: boolean
    timeSpent?: number
  }) {
    try {
      await this.connect()
      const progress = await StudentProgress.create(answerData)
      return progress
    } catch (error) {
      console.error("Database error recording answer:", error)
      throw error
    }
  }

  static async completeWorkshop(completionData: {
    studentId: string
    workshopId: string
    score: number
    questionsAnswered: number
    totalQuestions: number
    openQuestionsCount?: number
    status?: string
    timeSpent?: number
  }) {
    try {
      await this.connect()
      const hasOpen = (completionData.openQuestionsCount ?? 0) > 0
      const completion = await WorkshopCompletion.create({
        ...completionData,
        status: hasOpen ? "pending_review" : "auto_graded",
        // nota automática solo si no hay preguntas abiertas (escala colombiana 1.0-5.0)
        finalGrade: hasOpen ? undefined : parseFloat((1.0 + (completionData.score / 100) * 4.0).toFixed(1)),
      })

      // XP solo se otorga inmediatamente si no hay preguntas abiertas pendientes
      if (!hasOpen) {
        const pointsEarned = Math.floor(completionData.score * 10)
        await Student.findByIdAndUpdate(completionData.studentId, {
          $inc: { points: pointsEarned },
        })
      }

      return completion
    } catch (error) {
      console.error("Database error completing workshop:", error)
      throw error
    }
  }

  // Obtener todas las entregas pendientes de revisión para un docente
  static async getPendingReviews(teacherId: string) {
    try {
      await this.connect()
      // Talleres creados por este docente
      const workshops = await Workshop.find({ createdBy: teacherId }).lean()
      const workshopIds = workshops.map((w: any) => w._id)

      const pending = await WorkshopCompletion.find({
        workshopId: { $in: workshopIds },
        status: "pending_review",
      })
        .populate("studentId", "firstName lastName grade tarjetaIdentidad")
        .populate("workshopId", "title grade subject")
        .sort({ completedAt: -1 })
        .lean()

      return pending
    } catch (error) {
      console.error("Database error getting pending reviews:", error)
      return []
    }
  }

  // Obtener detalle completo de una entrega (respuestas abiertas para calificar)
  static async getCompletionDetail(completionId: string) {
    try {
      await this.connect()
      const completion = await WorkshopCompletion.findById(completionId)
        .populate("studentId", "firstName lastName grade tarjetaIdentidad")
        .populate("workshopId", "title grade subject description")
        .lean()
      if (!completion) return null

      // Obtener respuestas del estudiante para este taller
      const answers = await StudentProgress.find({
        studentId: (completion as any).studentId._id,
        workshopId: (completion as any).workshopId._id,
      })
        .populate("questionId", "questionText questionType options correctAnswer explanation competence referenceText")
        .lean()

      return { completion, answers }
    } catch (error) {
      console.error("Database error getting completion detail:", error)
      return null
    }
  }

  // Calificar preguntas abiertas de una entrega y calcular nota final
  // grades[].percentage = 0-100 (% de crédito que otorga el docente por esa pregunta)
  static async gradeOpenAnswers(
    completionId: string,
    teacherId: string,
    grades: Array<{ progressId: string; percentage: number; feedback?: string }>
  ) {
    try {
      await this.connect()
      const completion = await WorkshopCompletion.findById(completionId)
        .populate("workshopId", "title")
        .lean()
      if (!completion) throw new Error("Entrega no encontrada")

      // Aplicar porcentajes a cada respuesta abierta
      for (const g of grades) {
        await StudentProgress.findByIdAndUpdate(g.progressId, {
          teacherGrade: g.percentage,          // almacenamos 0-100
          teacherFeedback: g.feedback || "",
          isCorrect: g.percentage >= 50,        // >= 50% se considera correcto
          gradedAt: new Date(),
        })
      }

      // Obtener TODAS las respuestas del taller para recalcular nota final
      const allAnswers = await StudentProgress.find({
        studentId: (completion as any).studentId,
        workshopId: (completion as any).workshopId,
      }).lean()

      const totalQuestions = allAnswers.length
      if (totalQuestions === 0) throw new Error("Sin respuestas registradas")

      // Peso igual por pregunta
      const questionWeight = 100 / totalQuestions   // % que vale cada pregunta

      let finalScore = 0   // 0-100

      for (const ans of allAnswers) {
        const a = ans as any
        if (a.teacherGrade !== undefined && a.teacherGrade !== null) {
          // Pregunta abierta: docente asignó % de crédito (0-100)
          finalScore += (a.teacherGrade / 100) * questionWeight
        } else {
          // Pregunta MC: crédito completo si isCorrect
          if (a.isCorrect) finalScore += questionWeight
        }
      }

      finalScore = Math.min(100, Math.max(0, Math.round(finalScore * 10) / 10))
      const finalGrade = parseFloat((1.0 + (finalScore / 100) * 4.0).toFixed(1))
      const percentageScore = Math.round(finalScore)

      // Actualizar la entrega como revisada
      await WorkshopCompletion.findByIdAndUpdate(completionId, {
        status: "reviewed",
        finalGrade,
        score: percentageScore,
        gradedBy: teacherId,
        gradedAt: new Date(),
      })

      // Otorgar XP al estudiante
      const pointsEarned = Math.floor(percentageScore * 10)
      await Student.findByIdAndUpdate((completion as any).studentId, {
        $inc: { points: pointsEarned },
      })

      return { finalGrade, percentageScore, pointsEarned }
    } catch (error) {
      console.error("Database error grading open answers:", error)
      throw error
    }
  }

  // Obtener talleres completados del estudiante con estado de nota
  static async getStudentCompletionsWithGrades(studentId: string) {
    try {
      await this.connect()
      const completions = await WorkshopCompletion.find({ studentId })
        .populate("workshopId", "title subject grade difficulty")
        .sort({ completedAt: -1 })
        .lean()
      return completions
    } catch (error) {
      console.error("Database error getting completions with grades:", error)
      return []
    }
  }

  static async getStudentProgress(studentId: string) {
    try {
      await this.connect()
      const completions = await WorkshopCompletion.find({ studentId })
        .populate("workshopId")
        .sort({ completedAt: -1 })
        .lean()
      return completions
    } catch (error) {
      console.error("Database error getting student progress:", error)
      return []
    }
  }

  static async initializeDatabase() {
    try {
      console.log("═══════════════════════════════════════════════════════════")
      console.log("🚀 [DATABASE] Iniciando proceso de inicialización...")
      console.log("═══════════════════════════════════════════════════════════\n")
      await this.connect()

      // Verificar si ya hay datos
      const studentCount = await Student.countDocuments()
      const teacherCount = await Teacher.countDocuments()

      if (studentCount > 0 || teacherCount > 0) {
        console.log("ℹ️  [DATABASE] Base de datos ya inicializada")
        console.log(`   📚 Estudiantes existentes: ${studentCount}`)
        console.log(`   👨‍🏫 Docentes existentes: ${teacherCount}`)
        console.log("   ⏭️  Omitiendo inicialización de estudiantes/docentes...\n")

        // Siempre verificar y crear admin por defecto si no existe
        const adminCount = await Admin.countDocuments()
        if (adminCount === 0) {
          await Admin.create({
            firstName: "Administrador",
            lastName: "Sistema",
            cedula: "00000001",
            password: await bcrypt.hash("Admin@Lecto2025!", 10),
            email: "admin@lectoruta.edu.co",
          })
          console.log("✅ [DATABASE] Cuenta de administrador por defecto creada")
          console.log("   Cédula: 00000001 | Contraseña: Admin@Lecto2025!")
        }

        console.log("═══════════════════════════════════════════════════════════\n")
        return {
          success: true,
          message: "Base de datos ya contiene datos",
          studentsCount: studentCount,
          teachersCount: teacherCount,
        }
      }

      console.log("📝 [DATABASE] Creando estudiantes de prueba...")
      console.log("   Grado 10°: 5 estudiantes")
      console.log("   Grado 11°: 5 estudiantes")

      // ✅ Crear estudiantes de prueba
      const students = [
        {
          firstName: "Luis Enrique",
          lastName: "Pérez González",
          grade: 11,
          tarjetaIdentidad: "1098765432",
          password: await bcrypt.hash("1098765432", 10),
          email: "luis.perez@estudiante.uajs.edu.co",
          phoneNumber: "3001234567",
          birthDate: new Date("2007-03-15"),
        },
        {
          firstName: "Sofía María",
          lastName: "López Ramírez",
          grade: 11,
          tarjetaIdentidad: "1098765433",
          password: await bcrypt.hash("1098765433", 10),
          email: "sofia.lopez@estudiante.uajs.edu.co",
          phoneNumber: "3001234568",
          birthDate: new Date("2007-05-20"),
        },
        {
          firstName: "Carlos Andrés",
          lastName: "Ramírez Torres",
          grade: 10,
          tarjetaIdentidad: "1098765434",
          password: await bcrypt.hash("1098765434", 10),
          email: "carlos.ramirez@estudiante.uajs.edu.co",
          phoneNumber: "3001234569",
          birthDate: new Date("2008-07-12"),
        },
        {
          firstName: "Ana Patricia",
          lastName: "Martínez Díaz",
          grade: 10,
          tarjetaIdentidad: "1098765435",
          password: await bcrypt.hash("1098765435", 10),
          email: "ana.martinez@estudiante.uajs.edu.co",
          phoneNumber: "3001234570",
          birthDate: new Date("2008-09-25"),
        },
        {
          firstName: "Diego Fernando",
          lastName: "Sánchez Ruiz",
          grade: 11,
          tarjetaIdentidad: "1098765436",
          password: await bcrypt.hash("1098765436", 10),
          email: "diego.sanchez@estudiante.uajs.edu.co",
          phoneNumber: "3001234571",
          birthDate: new Date("2007-11-08"),
        },
        {
          firstName: "María Alejandra",
          lastName: "Gómez Castro",
          grade: 10,
          tarjetaIdentidad: "1098765437",
          password: await bcrypt.hash("1098765437", 10),
          email: "maria.gomez@estudiante.uajs.edu.co",
          phoneNumber: "3001234572",
          birthDate: new Date("2008-01-30"),
        },
        {
          firstName: "Juan Pablo",
          lastName: "Herrera Morales",
          grade: 11,
          tarjetaIdentidad: "1098765438",
          password: await bcrypt.hash("1098765438", 10),
          email: "juan.herrera@estudiante.uajs.edu.co",
          phoneNumber: "3001234573",
          birthDate: new Date("2007-04-18"),
        },
        {
          firstName: "Laura Camila",
          lastName: "Vargas Ortiz",
          grade: 10,
          tarjetaIdentidad: "1098765439",
          password: await bcrypt.hash("1098765439", 10),
          email: "laura.vargas@estudiante.uajs.edu.co",
          phoneNumber: "3001234574",
          birthDate: new Date("2008-06-22"),
        },
        {
          firstName: "Andrés Felipe",
          lastName: "Rodríguez Luna",
          grade: 11,
          tarjetaIdentidad: "1098765440",
          password: await bcrypt.hash("1098765440", 10),
          email: "andres.rodriguez@estudiante.uajs.edu.co",
          phoneNumber: "3001234575",
          birthDate: new Date("2007-08-14"),
        },
        {
          firstName: "Valentina Sofía",
          lastName: "Jiménez Parra",
          grade: 10,
          tarjetaIdentidad: "1098765441",
          password: await bcrypt.hash("1098765441", 10),
          email: "valentina.jimenez@estudiante.uajs.edu.co",
          phoneNumber: "3001234576",
          birthDate: new Date("2008-10-05"),
        },
      ]

      await Student.insertMany(students)
      console.log("✅ [DATABASE] Estudiantes creados exitosamente\n")

      console.log("👨‍🏫 [DATABASE] Creando docentes de prueba...")
      console.log("   Total: 3 docentes")
      console.log("   Contraseña predeterminada: LectoSaber2025!")

      // ✅ Crear docentes de prueba
      const teachers = [
        {
          firstName: "Patricia",
          lastName: "Díaz Mendoza",
          cedula: "48234567",
          password: await bcrypt.hash("LectoSaber2025!", 10),
          email: "patricia.diaz@docente.uajs.edu.co",
          institution: "Corporación Universitaria Antonio José de Sucre",
          subject: "Lengua Castellana",
          gradesTeaching: [10, 11],
        },
        {
          firstName: "Carlos",
          lastName: "Ramírez López",
          cedula: "52651850",
          password: await bcrypt.hash("LectoSaber2025!", 10),
          email: "carlos.ramirez@docente.uajs.edu.co",
          institution: "Corporación Universitaria Antonio José de Sucre",
          subject: "Lectura Crítica",
          gradesTeaching: [10, 11],
        },
        {
          firstName: "Ana María",
          lastName: "Torres Gómez",
          cedula: "40123456",
          password: await bcrypt.hash("LectoSaber2025!", 10),
          email: "ana.torres@docente.uajs.edu.co",
          institution: "Corporación Universitaria Antonio José de Sucre",
          subject: "Lengua Castellana",
          gradesTeaching: [10, 11],
        },
      ]

      await Teacher.insertMany(teachers)
      console.log("✅ [DATABASE] Docentes creados exitosamente\n")

      console.log("🔐 [DATABASE] Creando administrador por defecto...")
      const adminCount = await Admin.countDocuments()
      if (adminCount === 0) {
        await Admin.create({
          firstName: "Administrador",
          lastName: "Sistema",
          cedula: "00000001",
          password: await bcrypt.hash("Admin@Lecto2025!", 10),
          email: "admin@lectoruta.edu.co",
        })
        console.log("✅ [DATABASE] Administrador creado: cédula 00000001\n")
      }

      console.log("═══════════════════════════════════════════════════════════")
      console.log("🎉 [DATABASE] ¡Inicialización completada exitosamente!")
      console.log("═══════════════════════════════════════════════════════════")
      console.log(`📊 [DATABASE] Resumen:`)
      console.log(`   ✓ ${students.length} estudiantes creados`)
      console.log(`   ✓ ${teachers.length} docentes creados`)
      console.log(`\n📋 [DATABASE] Credenciales de acceso:`)
      console.log(`\n👨‍🎓 ESTUDIANTES (solo Tarjeta de Identidad):`)
      students.forEach((s) => {
        console.log(`   • ${s.firstName} ${s.lastName} - Tarjeta: ${s.tarjetaIdentidad} - Grado ${s.grade}°`)
      })
      console.log(`\n👨‍🏫 DOCENTES (Cédula + Contraseña):`)
      teachers.forEach((t) => {
        console.log(`   • ${t.firstName} ${t.lastName} - Cédula: ${t.cedula} - Contraseña: LectoSaber2025!`)
      })
      console.log(`\n💡 [DATABASE] Ver credenciales completas en: MANUAL_USUARIO.md`)
      console.log("═══════════════════════════════════════════════════════════\n")

      return {
        success: true,
        message: "Base de datos inicializada con datos de prueba",
        students: students.length,
        teachers: teachers.length,
        credentials: {
          students: students.map((s) => ({
            nombre: `${s.firstName} ${s.lastName}`,
            tarjetaIdentidad: s.tarjetaIdentidad,
            grado: s.grade,
          })),
          teachers: teachers.map((t) => ({
            nombre: `${t.firstName} ${t.lastName}`,
            cedula: t.cedula,
            contraseña: "LectoSaber2025!",
          })),
        },
      }
    } catch (error) {
      console.error("═════════════════════��═════════════════════════════════════")
      console.error("❌ [DATABASE] ERROR AL INICIALIZAR BASE DE DATOS")
      console.error("═══════════════════════════════════════════════════════════")
      console.error("📋 Detalles:", error.message)
      console.error("\n💡 Revisa el manual: MANUAL_USUARIO.md")
      console.error("═══════════════════════════════════════════════════════════\n")
      return { success: false, error: error.message }
    }
  }

  static async assignWorkshopToStudents(workshopId: string, studentIds: string[]) {
    try {
      await this.connect()
      await Workshop.findByIdAndUpdate(workshopId, {
        $addToSet: { assignedTo: { $each: studentIds } },
      })
      return true
    } catch (error) {
      console.error("Error assigning workshop:", error)
      throw error
    }
  }

  static async getStudentAssignedWorkshops(studentId: string) {
    try {
      await this.connect()
      const workshops = await Workshop.find({
        assignedTo: studentId,
        isActive: true,
      })
        .populate("createdBy", "firstName lastName email subject")
        .lean()

      // For each workshop, get question count
      const workshopsWithDetails = await Promise.all(
        workshops.map(async (workshop: any) => {
          const questionCount = await Question.countDocuments({ workshopId: workshop._id })
          return {
            ...workshop,
            questionCount,
          }
        })
      )

      return workshopsWithDetails
    } catch (error) {
      console.error("Error getting assigned workshops:", error)
      return []
    }
  }

  static async getStudentsByGrade(grade: number) {
    try {
      await this.connect()
      const students = await Student.find({ grade }).lean()
      return students
    } catch (error) {
      console.error("Error getting students by grade:", error)
      return []
    }
  }

  // ========== BIBLIOTECA ICFES - RECURSOS ==========

  static async createResource(data: any) {
    try {
      await this.connect()
      const resource = await Resource.create(data)
      return resource
    } catch (error) {
      console.error("Error creating resource:", error)
      throw error
    }
  }

  static async getResources(filters: { grade?: number; type?: string; category?: string } = {}) {
    try {
      await this.connect()
      const query: any = { isPublished: true }
      if (filters.grade) query.targetGrades = filters.grade
      if (filters.type) query.type = filters.type
      if (filters.category) query.category = filters.category

      const resources = await Resource.find(query)
        .populate("createdBy", "firstName lastName subject")
        .sort({ createdAt: -1 })
        .lean()
      return resources
    } catch (error) {
      console.error("Error getting resources:", error)
      return []
    }
  }

  static async toggleLikeResource(resourceId: string, studentId: string) {
    try {
      await this.connect()
      const resource = await Resource.findById(resourceId)
      if (!resource) throw new Error("Recurso no encontrado")

      const index = resource.likes.indexOf(studentId)
      if (index > -1) {
        resource.likes.splice(index, 1)
      } else {
        resource.likes.push(studentId)
      }
      await resource.save()
      return { liked: index === -1, totalLikes: resource.likes.length }
    } catch (error) {
      console.error("Error toggling like:", error)
      throw error
    }
  }

  static async toggleSaveResource(resourceId: string, studentId: string) {
    try {
      await this.connect()
      const resource = await Resource.findById(resourceId)
      if (!resource) throw new Error("Recurso no encontrado")

      const index = resource.savedBy.indexOf(studentId)
      if (index > -1) {
        resource.savedBy.splice(index, 1)
      } else {
        resource.savedBy.push(studentId)
      }
      await resource.save()
      return { saved: index === -1 }
    } catch (error) {
      console.error("Error toggling save:", error)
      throw error
    }
  }

  static async deleteResource(resourceId: string) {
    try {
      await this.connect()
      await Resource.findByIdAndDelete(resourceId)
      return true
    } catch (error) {
      console.error("Error deleting resource:", error)
      throw error
    }
  }

  // ========== ADMINISTRADOR ==========

  static async findAdminByCedula(cedula: string) {
    try {
      await this.connect()
      const admin = await Admin.findOne({ cedula }).lean()
      return admin
    } catch (error) {
      console.error("Error finding admin:", error)
      return null
    }
  }

  static async verifyAdminPassword(cedula: string, password: string) {
    try {
      const admin = await this.findAdminByCedula(cedula)
      if (!admin) return null
      const isValid = await bcrypt.compare(password, admin.password)
      return isValid ? admin : null
    } catch (error) {
      console.error("Error verifying admin password:", error)
      return null
    }
  }

  static async getAllStudents() {
    try {
      await this.connect()
      const students = await Student.find({}).sort({ grade: 1, lastName: 1 }).lean()
      return students
    } catch (error) {
      console.error("Error getting all students:", error)
      return []
    }
  }

  static async getAllTeachers() {
    try {
      await this.connect()
      const teachers = await Teacher.find({}).sort({ lastName: 1 }).lean()
      return teachers
    } catch (error) {
      console.error("Error getting all teachers:", error)
      return []
    }
  }

  static async createStudentByAdmin(data: {
    firstName: string
    lastName: string
    grade: number
    tarjetaIdentidad: string
    password: string
    email: string
    phoneNumber: string
    birthDate: string
  }) {
    try {
      await this.connect()
      const existing = await Student.findOne({ tarjetaIdentidad: data.tarjetaIdentidad }).lean()
      if (existing) throw new Error("La tarjeta de identidad ya está registrada")

      const hashedPassword = await bcrypt.hash(data.password, 10)
      const student = await Student.create({
        firstName: data.firstName,
        lastName: data.lastName,
        grade: data.grade,
        tarjetaIdentidad: data.tarjetaIdentidad,
        password: hashedPassword,
        email: data.email,
        phoneNumber: data.phoneNumber,
        birthDate: new Date(data.birthDate),
        points: 0,
        level: 1,
      })
      return student
    } catch (error) {
      console.error("Error creating student by admin:", error)
      throw error
    }
  }

  static async createTeacherByAdmin(data: {
    firstName: string
    lastName: string
    cedula: string
    password: string
    email: string
    institution: string
    subject: string
    gradesTeaching: number[]
  }) {
    try {
      await this.connect()
      const existing = await Teacher.findOne({ cedula: data.cedula }).lean()
      if (existing) throw new Error("La cédula ya está registrada")

      const hashedPassword = await bcrypt.hash(data.password, 10)
      const teacher = await Teacher.create({
        firstName: data.firstName,
        lastName: data.lastName,
        cedula: data.cedula,
        password: hashedPassword,
        email: data.email,
        institution: data.institution,
        subject: data.subject,
        gradesTeaching: data.gradesTeaching,
      })
      return teacher
    } catch (error) {
      console.error("Error creating teacher by admin:", error)
      throw error
    }
  }

  static async deleteStudentById(studentId: string) {
    try {
      await this.connect()
      await Student.findByIdAndDelete(studentId)
      return true
    } catch (error) {
      console.error("Error deleting student:", error)
      throw error
    }
  }

  static async deleteTeacherById(teacherId: string) {
    try {
      await this.connect()
      await Teacher.findByIdAndDelete(teacherId)
      return true
    } catch (error) {
      console.error("Error deleting teacher:", error)
      throw error
    }
  }

  static async updateStudentById(studentId: string, data: Partial<{
    firstName: string
    lastName: string
    grade: number
    email: string
    phoneNumber: string
  }>) {
    try {
      await this.connect()
      const student = await Student.findByIdAndUpdate(studentId, { ...data, updatedAt: new Date() }, { new: true })
      return student
    } catch (error) {
      console.error("Error updating student:", error)
      throw error
    }
  }

  static async updateTeacherById(teacherId: string, data: Partial<{
    firstName: string
    lastName: string
    email: string
    institution: string
    subject: string
    gradesTeaching: number[]
  }>) {
    try {
      await this.connect()
      const teacher = await Teacher.findByIdAndUpdate(teacherId, { ...data, updatedAt: new Date() }, { new: true })
      return teacher
    } catch (error) {
      console.error("Error updating teacher:", error)
      throw error
    }
  }
}

// ============================================================================
// EXPORTAR MODELOS
// ============================================================================
export { User, Student, Teacher, Admin, Session, LoginAttempt, Workshop, Question, StudentProgress, WorkshopCompletion, Resource }
