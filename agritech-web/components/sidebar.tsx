"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Calendar,
  FileText,
  Rocket,
  Users,
  MessageSquare,
  Settings,
  Bell,
  User,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Globe,
  Mail,
  GraduationCap,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const menuItems = [
  { icon: Home, label: "Accueil", href: "/", notifications: 0 },
  { icon: FileText, label: "Blog", href: "/blog", notifications: 2 },
  { icon: Calendar, label: "Événements", href: "/events", notifications: 2 },
  { icon: FileText, label: "Publications", href: "/publications", notifications: 5 },
  { icon: Rocket, label: "Start-ups", href: "/startups", notifications: 8 },
  { icon: Users, label: "Influenceurs", href: "/influencers", notifications: 1 },
  { icon: GraduationCap, label: "Formations", href: "/formations", notifications: 2 },
  { icon: Globe, label: "Institutionnel", href: "/government", notifications: 3 },
  { icon: Mail, label: "Newsletter", href: "/newsletter", notifications: 0 },
  { icon: MessageSquare, label: "Chat IA", href: "/chat", notifications: 0 },
  { icon: Settings, label: "Paramètres", href: "/settings", notifications: 0 },
  { icon: LogOut,label: "Déconnexion", href: null, isLogout: true },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname();
  const { user } = useUser()
  if (!user) return null
  
  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-all duration-300 shadow-lg",
        isCollapsed ? "w-16" : "w-72",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-sidebar-foreground text-lg">AgriTech AI</h2>
                <p className="text-xs text-sidebar-foreground/70 font-medium">Plateforme Officielle</p>
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-sidebar-border bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-2 border-primary/20">
            <User className="w-6 h-6 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="font-semibold text-sidebar-foreground">{fullName}</p>
              <p className="text-xs text-sidebar-foreground/70">Analyste AgriTech Senior</p>
            </div>
          )}
          <div className={cn("relative", isCollapsed && "hidden")}>
            <Bell className="w-5 h-5 text-sidebar-foreground/70 hover:text-primary transition-colors cursor-pointer" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href
             if (item.isLogout) {
                return (
                   <Button
                      key={index}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-12 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg"
                          : "text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/50 hover:to-transparent hover:text-sidebar-accent-foreground",
                        isCollapsed && "justify-center px-0",
                      )}
                  >
                  <LogOut className="w-5 h-5" />
                  {!isCollapsed && (
                    <>
                     <SignOutButton key={index}>
                        <span className="flex-1 text-left font-medium">Se déconnecter</span>
                    </SignOutButton>
                    </>
                  )}
                </Button>
                )
            }
            return (
              <Link key={index} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg"
                      : "text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/50 hover:to-transparent hover:text-sidebar-accent-foreground",
                    isCollapsed && "justify-center px-0",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      {item.notifications > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-secondary text-secondary-foreground text-xs font-semibold animate-pulse"
                        >
                          {item.notifications}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!isCollapsed && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse shadow-lg"></div>
              <span className="text-sm font-semibold text-sidebar-foreground">IA Active</span>
            </div>
            <p className="text-xs text-sidebar-foreground/70 leading-relaxed">
              Surveillance en temps réel des tendances AgriTech mondiales
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
