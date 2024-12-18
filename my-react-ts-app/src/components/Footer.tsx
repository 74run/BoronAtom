import { Link } from "wouter";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  FileText,
  FileEdit,
  Heart,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 xl:gap-16 mb-12">
          {/* Brand section */}
          <div className="space-y-6">
            <Link href="/">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity inline-block">
                ResumeCraft
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Create professional resumes with AI-powered tools and modern templates.
              Stand out from the crowd and land your dream job.
            </p>
            <div className="flex items-center space-x-5">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Product section */}
          <div className="space-y-6">
            <h3 className="text-base font-semibold">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/builder" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <FileText className="h-4 w-4 group-hover:text-blue-500 transition-colors" />
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link 
                  href="/ai-cover-letter" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <FileEdit className="h-4 w-4 group-hover:text-blue-500 transition-colors" />
                  Cover Letter Generator
                </Link>
              </li>
              <li>
                <Link 
                  href="/templates" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors pl-6"
                >
                  Resume Templates
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors pl-6"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources section */}
          <div className="space-y-6">
            <h3 className="text-base font-semibold">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/blog" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors pl-6"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/guides" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors pl-6"
                >
                  Career Guides
                </Link>
              </li>
              <li>
                <Link 
                  href="/examples" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors pl-6"
                >
                  Resume Examples
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors pl-6"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact section */}
          <div className="space-y-6">
            <h3 className="text-base font-semibold">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:support@resumecraft.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <Mail className="h-4 w-4 group-hover:text-blue-500 transition-colors" />
                  support@resumecraft.com
                </a>
              </li>
              <li>
                <Link 
                  href="/support" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors pl-6"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/feedback" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors pl-6"
                >
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t pt-8">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 md:gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-center md:text-left text-sm text-muted-foreground flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-red-500 animate-pulse" /> by{" "}
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:text-primary transition-colors hover:underline underline-offset-4"
                >
                  Your Name
                </a>
              </p>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                © {currentYear} ResumeCraft. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
