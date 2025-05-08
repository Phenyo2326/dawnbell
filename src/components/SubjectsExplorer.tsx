
import { useState } from "react";
import { subjects } from "@/data/tutors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Book } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SubjectsExplorerProps {
  onSubjectSelect: (subject: string) => void;
}

const SubjectsExplorer = ({ onSubjectSelect }: SubjectsExplorerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSubjects = subjects.filter(subject => 
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const subjectCategories = {
    "Mathematics": ["Mathematics", "Calculus", "Statistics"],
    "Sciences": ["Physics", "Chemistry", "Biology"],
    "Languages": ["English", "Spanish", "French"],
    "Social Sciences": ["History", "Political Science"],
    "Other": ["Essay Writing", "Computer Science"]
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Browse Subjects
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search subjects..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {searchQuery ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Search Results</h3>
            <div className="flex flex-wrap gap-2">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <Badge 
                    key={subject}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => onSubjectSelect(subject)}
                  >
                    {subject}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No subjects found</p>
              )}
            </div>
          </div>
        ) : (
          Object.entries(subjectCategories).map(([category, subjectsInCategory]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {subjectsInCategory.map((subject) => (
                  <Badge 
                    key={subject}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => onSubjectSelect(subject)}
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default SubjectsExplorer;
