'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase/client'
import { User, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            OASIS BI PRO
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              href="/#features"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Fitur
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Harga
            </Link>
            <Link
              href="/roadmap"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Roadmap
            </Link>
            <Link
              href="/legal/faq"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              FAQ
            </Link>

            {/* Auth Buttons */}
            {loading ? (
              <div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link href="/member/dashboard">
                  <Button variant="outline" className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <div className="relative group">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 border border-gray-300"
                  >
                    <User className="w-4 h-4" />
                    <span className="max-w-[100px] truncate">
                      {user.email}
                    </span>
                  </Button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        href="/member/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      <Link
                        href="/member/analytics"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="font-medium">Analytics</span>
                      </Link>
                      <Link
                        href="/member/features"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="font-medium">Features</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="border-primary-600 text-primary-600 hover:bg-primary-50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    Start Free →
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {user ? (
              <Link href="/member/dashboard">
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/signup">
                <Button size="sm" className="bg-primary-600 text-white">
                  Start Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
