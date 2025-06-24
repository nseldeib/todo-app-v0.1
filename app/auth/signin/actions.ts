"use server"

import { createClient } from "@supabase/supabase-js"

// Server-side Supabase client with service role key for admin operations
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function createDemoUser() {
  try {
    // First, let's check what enum values are available
    const { data: enumData, error: enumError } = await supabaseAdmin.rpc("get_enum_values")

    if (enumError) {
      console.log("Could not fetch enum values, using default values")
    }

    // Create the demo user using admin client
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: "demo@taskvault.com",
      password: "demo123456",
      email_confirm: true,
      user_metadata: {
        username: "Demo User",
      },
    })

    if (userError) {
      console.error("Error creating demo user:", userError)
      return { success: false, error: userError.message }
    }

    if (!userData.user) {
      return { success: false, error: "Failed to create user" }
    }

    const userId = userData.user.id

    // Create demo project
    const { data: projectData, error: projectError } = await supabaseAdmin
      .from("projects")
      .insert([
        {
          user_id: userId,
          name: "Welcome Project",
          description: "Your first project to get started with TaskVault",
          emoji: "🚀",
        },
      ])
      .select()
      .single()

    if (projectError) {
      console.error("Error creating demo project:", projectError)
      // Continue even if project creation fails
    }

    const projectId = projectData?.id

    // Create demo tasks with proper enum values
    // Using common enum values that are likely to exist
    const demoTasks = [
      {
        user_id: userId,
        project_id: projectId,
        title: "Welcome to TaskVault!",
        description: "This is your first task. Click the status buttons to change its state.",
        // Using common enum values - adjust these based on your actual enum
        status: "todo", // Common alternatives: "pending", "open", "new"
        priority: "medium", // Common alternatives: "normal", "mid"
        is_important: true,
        emoji: "👋",
      },
      {
        user_id: userId,
        project_id: projectId,
        title: "Explore the dark theme",
        description: "Notice the edgy design with glass effects and neon glows.",
        status: "in_progress", // Common alternatives: "doing", "active"
        priority: "low",
        is_important: false,
        emoji: "🌙",
      },
      {
        user_id: userId,
        project_id: projectId,
        title: "Add your own tasks",
        description: "Use the form above to create your own tasks and organize your work.",
        status: "done", // Common alternatives: "completed", "finished"
        priority: "high",
        is_important: false,
        emoji: "✅",
      },
      {
        user_id: userId,
        project_id: projectId,
        title: "Delete tasks you don't need",
        description: "Click the trash icon to remove tasks when you're done with them.",
        status: "todo",
        priority: "medium",
        is_important: false,
        emoji: "🗑️",
      },
    ]

    // Try inserting tasks one by one to identify which values work
    for (const task of demoTasks) {
      const { error: taskError } = await supabaseAdmin.from("tasks").insert([task])

      if (taskError) {
        console.error(`Error creating task "${task.title}":`, taskError)

        // Try alternative enum values if the first attempt fails
        const alternativeTask = {
          ...task,
          status: "todo", // Fallback status
          priority: "medium", // Fallback priority
        }

        // Remove priority if it's causing issues
        delete alternativeTask.priority

        const { error: retryError } = await supabaseAdmin.from("tasks").insert([alternativeTask])

        if (retryError) {
          console.error(`Retry failed for task "${task.title}":`, retryError)
        }
      }
    }

    return { success: true, userId }
  } catch (error) {
    console.error("Unexpected error creating demo user:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
