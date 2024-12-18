import { Link } from "wouter";
import { Button } from "./ui/button";
import {
  FileText,
  FileEdit,
  Download,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.900),transparent)]" />
          <div className="absolute inset-y-0 right-0 -z-10 w-[50vw] bg-gradient-to-l from-blue-50 to-transparent dark:from-blue-950" />
          <div className="absolute top-0 left-0 -z-10 h-[50vh] w-[50vw] bg-gradient-to-br from-blue-50 via-transparent to-transparent dark:from-blue-950" />
          <div className="absolute -top-4 -left-4 -z-10 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 blur-xl opacity-20 animate-pulse" />
          <div className="absolute top-1/3 right-1/4 -z-10 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 blur-xl opacity-20 animate-pulse delay-300" />
        </div>

        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4 mb-16 md:w-1/2 md:mb-0">
              <div className="relative">
                <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                  Create Professional Resumes in Minutes
                </h1>
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
              </div>
              <p className="mb-8 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
                Stand out from the crowd with our AI-powered resume builder. 
                Create ATS-friendly resumes and get more interviews.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2">
              <div className="relative mx-auto md:mr-0 max-w-max">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/30">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950">
                    <div className="absolute inset-0 bg-grid-slate-200/20 [mask-image:linear-gradient(0deg,white,transparent)] dark:bg-grid-slate-700/20" />
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse delay-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="max-w-xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Why Choose ResumeCraft?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Everything you need to create a professional resume that stands out
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-block p-4 mb-6 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-4 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
            Join thousands of job seekers who've successfully landed their dream jobs
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90">
              Start Building Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: FileText,
    title: "Professional Templates",
    description: "Choose from a variety of ATS-friendly templates designed by HR professionals.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Assistance",
    description: "Get smart suggestions to improve your resume content and increase your chances.",
  },
  {
    icon: FileEdit,
    title: "Easy to Edit",
    description: "Intuitive interface that makes creating and updating your resume a breeze.",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Export your resume in various formats including PDF, Word, and plain text.",
  },
  {
    icon: CheckCircle,
    title: "ATS Optimization",
    description: "Ensure your resume passes Applicant Tracking Systems with our built-in checker.",
  },
  {
    icon: FileText,
    title: "Cover Letters",
    description: "Generate matching cover letters using AI to complete your application.",
  },
];


export default Home