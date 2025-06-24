"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Plus, LogOut, CheckCircle, Clock, AlertCircle, Trash2 } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  status: string // Changed to string to handle any enum value
  priority?: string // Changed to string to handle any enum value
  is_important?: boolean
  emoji?: string
  created_at: string
  user_id: string
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchTasks()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/signin")
    } else {
      setUser(user)
    }
  }

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching tasks:", error)
      } else {
        setTasks(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    try {
      // Use the most basic values that are likely to work
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title: newTaskTitle,
            description: newTaskDescription,
            // Try common enum values - adjust based on your actual enums
            status: "todo", // or try "pending", "open", "new"
            user_id: user?.id,
          },
        ])
        .select()

      if (error) {
        console.error("Error adding task:", error)
        // Try alternative values if the first attempt fails
        const { data: retryData, error: retryError } = await supabase
          .from("tasks")
          .insert([
            {
              title: newTaskTitle,
              description: newTaskDescription,
              user_id: user?.id,
              // Don't set status/priority, let database use defaults
            },
          ])
          .select()

        if (retryError) {
          console.error("Retry error:", retryError)
        } else {
          setTasks([...retryData, ...tasks])
          setNewTaskTitle("")
          setNewTaskDescription("")
        }
      } else {
        setTasks([...data, ...tasks])
        setNewTaskTitle("")
        setNewTaskDescription("")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId)

      if (error) {
        console.error("Error updating task:", error)
      } else {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId)

      if (error) {
        console.error("Error deleting task:", error)
      } else {
        setTasks(tasks.filter((task) => task.id !== taskId))
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const getStatusIcon = (status: string) => {
    // Handle various possible enum values
    const lowerStatus = status?.toLowerCase()
    if (lowerStatus?.includes("complete") || lowerStatus?.includes("done") || lowerStatus?.includes("finish")) {
      return <CheckCircle className="w-4 h-4 text-green-400" />
    } else if (lowerStatus?.includes("progress") || lowerStatus?.includes("doing") || lowerStatus?.includes("active")) {
      return <Clock className="w-4 h-4 text-yellow-400" />
    } else {
      return <AlertCircle className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase()
    if (lowerStatus?.includes("complete") || lowerStatus?.includes("done") || lowerStatus?.includes("finish")) {
      return "bg-green-900/50 text-green-400 border-green-800"
    } else if (lowerStatus?.includes("progress") || lowerStatus?.includes("doing") || lowerStatus?.includes("active")) {
      return "bg-yellow-900/50 text-yellow-400 border-yellow-800"
    } else {
      return "bg-red-900/50 text-red-400 border-red-800"
    }
  }

  const getPriorityColor = (priority?: string) => {
    const lowerPriority = priority?.toLowerCase()
    if (lowerPriority?.includes("high") || lowerPriority?.includes("urgent")) {
      return "bg-red-900/50 text-red-400 border-red-800"
    } else if (lowerPriority?.includes("medium") || lowerPriority?.includes("normal")) {
      return "bg-yellow-900/50 text-yellow-400 border-yellow-800"
    } else if (lowerPriority?.includes("low")) {
      return "bg-blue-900/50 text-blue-400 border-blue-800"
    } else {
      return "bg-gray-900/50 text-gray-400 border-gray-800"
    }
  }

  // Get available status options based on existing tasks
  const getStatusOptions = () => {
    const uniqueStatuses = [...new Set(tasks.map((task) => task.status).filter(Boolean))]
    return uniqueStatuses.length > 0 ? uniqueStatuses : ["todo", "in_progress", "done"]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading your vault...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TaskVault
            </h1>
            <p className="text-gray-400 mt-2">
              Welcome back, {user?.email === "demo@taskvault.com" ? "Demo User" : user?.email}
              {user?.email === "demo@taskvault.com" && (
                <span className="ml-2 text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">DEMO</span>
              )}
            </p>
          </div>
          <Button onClick={handleSignOut} className="btn-secondary">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Add Task Form */}
        <Card className="glass-effect border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addTask} className="space-y-4">
              <Input
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                required
              />
              <Input
                placeholder="Task description (optional)..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white focus:border-purple-500"
              />
              <Button type="submit" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tasks Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="task-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {task.emoji && <span className="text-lg">{task.emoji}</span>}
                    <h3 className="font-semibold text-white truncate">{task.title}</h3>
                  </div>
                  <Button
                    onClick={() => deleteTask(task.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {task.description && <p className="text-gray-400 text-sm mb-3">{task.description}</p>}

                <div className="flex items-center justify-between mb-3">
                  <Badge className={`${getStatusColor(task.status)} flex items-center gap-1`}>
                    {getStatusIcon(task.status)}
                    {task.status?.replace("_", " ") || "unknown"}
                  </Badge>

                  {task.priority && (
                    <Badge className={`${getPriorityColor(task.priority)} text-xs`}>{task.priority}</Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {/* Dynamic status buttons based on available statuses */}
                    {getStatusOptions().map(
                      (statusOption) =>
                        task.status !== statusOption && (
                          <Button
                            key={statusOption}
                            onClick={() => updateTaskStatus(task.id, statusOption)}
                            size="sm"
                            variant="ghost"
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 p-1"
                            title={`Change to ${statusOption}`}
                          >
                            {getStatusIcon(statusOption)}
                          </Button>
                        ),
                    )}
                  </div>

                  <div className="text-xs text-gray-500">{new Date(task.created_at).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No tasks yet</h3>
            <p className="text-gray-500">Add your first task to get started with TaskVault</p>
          </div>
        )}
      </div>
    </div>
  )
}
