import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { User, GraduationCap, Briefcase, FolderGit2, Stars } from "lucide-react";

import { Button } from "./components/ui/button";
import { useMutation } from "@tanstack/react-query";



export default function Builder() {
  
  const [activeTab, setActiveTab] = useState("personal");


 

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full bg-primary/5 p-1 rounded-lg">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary hover:bg-white/50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Personal
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary hover:bg-white/50 transition-colors"
                >
                  <GraduationCap className="h-4 w-4" />
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary hover:bg-white/50 transition-colors"
                >
                  <Briefcase className="h-4 w-4" />
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary hover:bg-white/50 transition-colors"
                >
                  <FolderGit2 className="h-4 w-4" />
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary hover:bg-white/50 transition-colors"
                >
                  <Stars className="h-4 w-4" />
                  Skills
                </TabsTrigger>
              </TabsList>

         </Tabs>

   
            </div>
          </div>
        </div>
      </div>

  );
}
