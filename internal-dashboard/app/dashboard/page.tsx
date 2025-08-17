"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FileText, Zap, Settings, LogOut, Camera, Moon, Sun, BookOpen, ExternalLink } from "lucide-react"
import { ReportGenerator } from "@/components/report-generator"
import Image from "next/image"

type ActiveSection = "jira" | "n8n" | "outline"

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [weatherData, setWeatherData] = useState([
    { city: "Marrakech", temp: "Loading...", condition: "Loading...", icon: "⏳" },
    { city: "Casablanca", temp: "Loading...", condition: "Loading...", icon: "⏳" },
    { city: "Rabat", temp: "Loading...", condition: "Loading...", icon: "⏳" },
    { city: "Tangier", temp: "Loading...", condition: "Loading...", icon: "⏳" },
  ])
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@company.com",
    password: "",
    profileImage: "/avatar.png",
  })

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!loggedIn) {
      window.location.href = "/"
    } else {
      setIsLoggedIn(true)
    }

    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    const updateTime = () => {
      const now = new Date()
      const moroccoTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Casablanca",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now)

      const moroccoDate = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Casablanca",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(now)

      setCurrentTime(moroccoTime)
      setCurrentDate(moroccoDate)
    }

    updateTime()
    const timeInterval = setInterval(updateTime, 1000)

    const fetchWeatherData = async () => {
      const cities = [
        { name: "Marrakech", lat: 31.6295, lon: -7.9811 },
        { name: "Casablanca", lat: 33.5731, lon: -7.5898 },
        { name: "Rabat", lat: 34.0209, lon: -6.8416 },
        { name: "Tangier", lat: 35.7595, lon: -5.834 },
      ]

      try {
        const weatherPromises = cities.map(async (city) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code&timezone=Africa%2FCasablanca`,
          )
          const data = await response.json()

          // Map weather codes to conditions and icons
          const getWeatherInfo = (code: number) => {
            if (code === 0) return { condition: "Clear", icon: "☀️" }
            if (code <= 3) return { condition: "Partly Cloudy", icon: "⛅" }
            if (code <= 48) return { condition: "Cloudy", icon: "☁️" }
            if (code <= 67) return { condition: "Rainy", icon: "🌧️" }
            if (code <= 77) return { condition: "Snowy", icon: "❄️" }
            if (code <= 82) return { condition: "Showers", icon: "🌦️" }
            return { condition: "Stormy", icon: "⛈️" }
          }

          const weatherInfo = getWeatherInfo(data.current.weather_code)

          return {
            city: city.name,
            temp: `${Math.round(data.current.temperature_2m)}°C`,
            condition: weatherInfo.condition,
            icon: weatherInfo.icon,
          }
        })

        const weatherResults = await Promise.all(weatherPromises)
        setWeatherData(weatherResults)
      } catch (error) {
        console.error("Failed to fetch weather data:", error)
        // Keep loading state if API fails
      }
    }

    fetchWeatherData()

    return () => clearInterval(timeInterval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    window.location.href = "/"
  }

  const handleProfileUpdate = () => {
    setProfileOpen(false)
  }

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData({ ...profileData, profileImage: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleN8nOpen = () => {
    window.open("https://genai.rubicon.ma/n8n/", "_blank")
  }

  const handleOutlineOpen = () => {
    window.open("/outline", "_blank")
  }

  if (!isLoggedIn) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 relative">
              {isDarkMode ? (
                <Image src="/images/logo_dark_mode.png" alt="Logo" width={32} height={32} className="rounded-lg" />
              ) : (
                <Image src="/images/logo_light_mode.png" alt="Logo" width={32} height={32} className="rounded-lg" />
              )}
            </div>
            <span className="text-xl font-semibold">GenAI Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
              <Moon className="h-4 w-4" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profileData.profileImage || "/placeholder.svg"} alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profileData.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{profileData.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Profile Settings</DialogTitle>
                      <DialogDescription>Update your profile information here.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Profile Image</Label>
                        <div className="col-span-3 flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={profileData.profileImage || "/placeholder.svg"} alt="Profile" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="profile-image-upload"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("profile-image-upload")?.click()}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Update Image
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter new password"
                          value={profileData.password}
                          onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setProfileOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleProfileUpdate}>Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content - Card Layout */}
      <main className="p-6">
        <div className="w-full mx-auto">
          <div className="space-y-6">
            {/* Jira Report Generator Card - Full Width */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {profileData.name.split(" ")[0]}! 👋
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Ready to generate your Jira reports? Check the weather across Morocco first.
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
                        <span className="text-2xl">🇲🇦</span>
                        <span>Morocco Time: {currentTime}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{currentDate}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {weatherData.map((weather, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{weather.city}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{weather.condition}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg">{weather.icon}</div>
                            <p className="font-bold text-gray-900 dark:text-white">{weather.temp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Jira Report Generator</CardTitle>
                    <CardDescription>Generate and manage PDF reports from Jira</CardDescription>
                  </div>
                </div>
                <ReportGenerator />
              </CardHeader>
            </Card>

            {/* Bottom Row - n8n and Outline Cards 50/50 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* n8n Automations Card */}
              <Card
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={handleN8nOpen}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        n8n Automations
                        <ExternalLink className="h-4 w-4" />
                      </CardTitle>
                      <CardDescription>Access internal automation workflows</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Outline Documentation Card */}
              <Card
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={handleOutlineOpen}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        Outline Documentation
                        <ExternalLink className="h-4 w-4" />
                      </CardTitle>
                      <CardDescription>Access Outline documentation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
