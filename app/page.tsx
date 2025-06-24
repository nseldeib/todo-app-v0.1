import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            TaskVault
          </h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto">
            Manage your tasks in the shadows. Dark, powerful, efficient.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/signin">
            <Button className="btn-primary">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="btn-secondary">Sign Up</Button>
          </Link>
        </div>

        <div className="mt-12 glass-effect rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-3 text-purple-400">Features</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• Secure authentication</li>
            <li>• Real-time task management</li>
            <li>• Dark, edgy interface</li>
            <li>• Status tracking</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
