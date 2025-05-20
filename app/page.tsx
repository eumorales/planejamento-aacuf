import { LoginFormModern } from "@/components/login-form-modern"
import { AACUFLogo } from "@/components/aacuf-logo"
import { initializeAdmin } from "@/lib/actions"
require('dotenv').config();

export default async function Home() {

  await initializeAdmin()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <AACUFLogo className="w-32 h-32" withGlow={false} />
        </div>
        <LoginFormModern />
      </div>
    </main>
  )
}
