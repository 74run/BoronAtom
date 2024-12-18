import React, { useState } from 'react';
import { Link } from "wouter";
import { Button } from "./button";
import { cn } from "../lib/utils";
import { Menu, FileText, FileEdit } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: FileText, label: "Resume Builder", href: "/" },
    { icon: FileEdit, label: "Cover Letter", href: "/ai-cover-letter" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800/60">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity group"
          >
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent transition-all duration-300">
              ResumeCraft
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <Button
                variant="outline"
                className="group relative px-6 py-2.5 text-sm font-medium transition-all"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-md" />
                <span className="relative flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold whitespace-nowrap dark:from-blue-400 dark:to-cyan-400">
                    {item.label}
                  </span>
                </span>
              </Button>
            </Link>
          ))}
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[280px] bg-gray-800 text-white">
              <div className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-5 h-5 text-blue-500" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
