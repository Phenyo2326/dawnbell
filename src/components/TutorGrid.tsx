
import { useState, useEffect } from "react";
import { tutors, subjects } from "@/data/tutors";
import TutorCard from "./TutorCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface TutorGridProps {
  initialSubject?: string | null;
}

const TutorGrid = ({ initialSubject = null }: TutorGridProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(initialSubject);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (initialSubject) {
      setSelectedSubject(initialSubject);
    }
  }, [initialSubject]);

  const filteredTutors = tutors.filter(tutor => {
    // Apply subject filter
    if (selectedSubject && !tutor.subjects.includes(selectedSubject)) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tutor.name.toLowerCase().includes(query) ||
        tutor.subjects.some(subject => subject.toLowerCase().includes(query)) ||
        tutor.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, subject, or keywords..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant={!selectedSubject ? "default" : "outline"}
              onClick={() => setSelectedSubject(null)}
              className={!selectedSubject ? "bg-primary" : ""}
            >
              All Subjects
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {subjects.slice(0, 8).map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                className={`text-sm ${selectedSubject === subject ? "bg-primary" : ""}`}
                onClick={() => setSelectedSubject(subject === selectedSubject ? null : subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>
        
        {filteredTutors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">No tutors found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TutorGrid;
