"use server"

import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createHash } from "crypto"

export type Task = {
  _id?: string | ObjectId
  name: string
  title: string
  notes: string
  sector: string
  dueDate: Date
  responsible?: string
  status: "active" | "expired" | "completed"
  createdAt: Date
}

export type User = {
  _id?: string | ObjectId
  username: string
  password: string
  name: string
  role: "admin" | "director"
  sector?: string
  createdAt: Date
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword
}

export async function initializeAdmin() {

  return true
}

export async function login(username: string, password: string) {
  const client = await clientPromise
  const db = client.db()

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {

    const cookieStore = await cookies()
    cookieStore.set("user", JSON.stringify({ username, role: "admin" }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, 
      path: "/",
    })

    return { username, role: "admin" }
  }

  const user = await db.collection("users").findOne({ username })

  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  const passwordMatch = verifyPassword(password, user.password)

  if (!passwordMatch) {
    throw new Error("Senha incorreta")
  }

  const cookieStore = await cookies()
  cookieStore.set(
    "user",
    JSON.stringify({
      id: user._id.toString(),
      username: user.username,
      name: user.name,
      role: user.role,
      sector: user.sector,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, 
      path: "/",
    },
  )

  return {
    id: user._id.toString(),
    username: user.username,
    name: user.name,
    role: user.role,
    sector: user.sector,
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("user")
}

export async function getLoggedInUser() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("user")

  if (!userCookie) {
    return null
  }

  try {
    return JSON.parse(userCookie.value)
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getLoggedInUser()

  if (!user) {
    redirect("/")
  }

  return user
}

export async function requireAdmin() {
  const user = await getLoggedInUser()

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  return user
}

export async function getUsers() {
  await requireAdmin()

  const client = await clientPromise
  const db = client.db()
  const users = await db.collection("users").find({ role: "director" }).toArray()

  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
    password: undefined, // Não enviar a senha para o client
    createdAt: new Date(user.createdAt),
  }))
}

export async function createUser(userData: {
  username: string
  password: string
  name: string
  role: string
  sector?: string
}) {
  await requireAdmin()

  const client = await clientPromise
  const db = client.db()

  const existingUser = await db.collection("users").findOne({ username: userData.username })

  if (existingUser) {
    throw new Error("Nome de usuário já existe")
  }

  // Hash 
  const hashedPassword = hashPassword(userData.password)

  const newUser = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
  }

  const result = await db.collection("users").insertOne(newUser)

  revalidatePath("/admin/users")

  return {
    ...newUser,
    _id: result.insertedId.toString(),
    password: undefined, 
  }
}

export async function updateUser(id: string, userData: { name?: string; password?: string; sector?: string }) {
  await requireAdmin()

  const client = await clientPromise
  const db = client.db()

  const updateData: any = {}

  if (userData.name) updateData.name = userData.name
  if (userData.sector) updateData.sector = userData.sector

  if (userData.password) {
    updateData.password = hashPassword(userData.password)
  }

  const result = await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

  revalidatePath("/admin/users")

  return result.modifiedCount > 0
}

export async function deleteUser(id: string) {
  await requireAdmin()

  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) })

  revalidatePath("/admin/users")

  return result.deletedCount > 0
}

export async function getTasks() {
  await requireAuth()

  const client = await clientPromise
  const db = client.db()
  const tasks = await db.collection("tasks").find({}).toArray()

  return tasks.map((task) => ({
    ...task,
    _id: task._id.toString(),
    dueDate: new Date(task.dueDate),
    createdAt: new Date(task.createdAt),
  }))
}

export async function getTasksBySector(sector: string) {
  await requireAuth()

  const client = await clientPromise
  const db = client.db()
  const tasks = await db.collection("tasks").find({ sector }).toArray()

  return tasks.map((task) => ({
    ...task,
    _id: task._id.toString(),
    dueDate: new Date(task.dueDate),
    createdAt: new Date(task.createdAt),
  }))
}

export async function createTask(task: Omit<Task, "_id" | "createdAt" | "status">) {
  await requireAuth()

  const client = await clientPromise
  const db = client.db()

  const newTask = {
    ...task,
    status: "active",
    createdAt: new Date(),
    dueDate: new Date(task.dueDate),
  }

  const result = await db.collection("tasks").insertOne(newTask)

  revalidatePath("/admin")
  revalidatePath("/dashboard")

  return {
    ...newTask,
    _id: result.insertedId.toString(),
  }
}

export async function updateTask(id: string, task: Partial<Task>) {
  await requireAuth()

  const client = await clientPromise
  const db = client.db()

  const updateData: any = { ...task }

  if (updateData.responsible === undefined && "responsible" in updateData) {

    const result = await db.collection("tasks").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(updateData.name !== undefined && { name: updateData.name }),
          ...(updateData.title !== undefined && { title: updateData.title }),
          ...(updateData.notes !== undefined && { notes: updateData.notes }),
          ...(updateData.sector !== undefined && { sector: updateData.sector }),
          ...(updateData.dueDate !== undefined && { dueDate: updateData.dueDate }),
          ...(updateData.status !== undefined && { status: updateData.status }),
        },
        $unset: { responsible: "" },
      },
    )

    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return result.modifiedCount > 0
  } else {

    const result = await db.collection("tasks").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return result.modifiedCount > 0
  }
}

export async function assignTask(id: string, responsible: string) {
  await requireAuth()

  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("tasks").updateOne({ _id: new ObjectId(id) }, { $set: { responsible } })

  revalidatePath("/admin")
  revalidatePath("/dashboard")

  return result.modifiedCount > 0
}

export async function deleteTask(id: string) {
  await requireAuth()

  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("tasks").deleteOne({ _id: new ObjectId(id) })

  revalidatePath("/admin")
  revalidatePath("/dashboard")

  return result.deletedCount > 0
}

export async function updateExpiredTasks() {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("tasks").updateMany(
    {
      dueDate: { $lt: new Date() },
      status: "active",
    },
    { $set: { status: "expired" } },
  )

  return result.modifiedCount
}

export async function completeTask(id: string) {
  
  return updateTask(id, { status: "completed" })

}

export async function reactivateTask(id: string) {
  return updateTask(id, { status: "active" })
}
