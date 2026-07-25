import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isSignUp && !name) {
      setError("Please enter your name.")
      return
    }
    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }

    setIsLoading(true)

    try {
      const endpoint = isSignUp ? "/auth/register" : "/auth/login"
      const payload = isSignUp ? { name, email, password } : { email, password }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Please try again.")
      }

      // Save token and login status
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("currentUser", JSON.stringify(data.user))

      setIsLoading(false)
      if (onLoginSuccess) {
        onLoginSuccess()
      } else {
        navigate("/dashboard")
      }
    } catch (err: any) {
      setIsLoading(false)
      setError(err.message || "Something went wrong.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-none border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-xl">
            {isSignUp ? "Create an Account" : "Welcome to Ethics Library"}
          </CardTitle>
          <CardDescription>
            {isSignUp ? "Sign up to manage digital catalog and reading stats" : "Access your digital library catalog and reading stats"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {isSignUp && (
                <div className="grid gap-2 text-left">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Amit Sharma"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-none"
                  />
                </div>
              )}
              <div className="grid gap-2 text-left">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-none"
                />
              </div>
              <div className="grid gap-2 text-left">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-none"
                />
              </div>
              {error && (
                <div className="text-xs text-destructive font-medium bg-destructive/10 p-2 border border-destructive/20">
                  {error}
                </div>
              )}
              <Button type="submit" disabled={isLoading} className="w-full rounded-none cursor-pointer">
                {isLoading ? (isSignUp ? "Creating account..." : "Logging in...") : (isSignUp ? "Sign Up" : "Login")}
              </Button>
              <div className="text-center text-xs">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <a
                      href="#"
                      className="underline underline-offset-4 font-medium"
                      onClick={(e) => {
                        e.preventDefault()
                        setError("")
                        setIsSignUp(false)
                      }}
                    >
                      Login
                    </a>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <a
                      href="#"
                      className="underline underline-offset-4 font-medium"
                      onClick={(e) => {
                        e.preventDefault()
                        setError("")
                        setIsSignUp(true)
                      }}
                    >
                      Sign up
                    </a>
                  </>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
