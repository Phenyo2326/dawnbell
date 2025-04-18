
import { Button } from "@/components/ui/button";
import { Star, Clock, GraduationCap } from "lucide-react";
import { Tutor } from "@/data/tutors";

interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard = ({ tutor }: TutorCardProps) => {
  return (
    <div className="tutor-card bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <img 
            src={tutor.avatar} 
            alt={`${tutor.name}'s profile picture`}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{tutor.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{tutor.education}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {tutor.subjects.slice(0, 3).map((subject, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2 py-1 bg-secondary rounded-full"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
          <div className="tutor-rating flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-medium">{tutor.rating}</span>
            <span className="text-xs text-muted-foreground">({tutor.reviews})</span>
          </div>
        </div>

        <p className="text-sm mt-4 line-clamp-2">{tutor.description}</p>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span>{tutor.availability}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">${tutor.hourlyRate}/hr</span>
          </div>
        </div>
      </div>
      
      <div className="flex border-t">
        <Button className="flex-1 rounded-none" variant="ghost">
          View Profile
        </Button>
        <Button className="flex-1 rounded-none">
          Book Session
        </Button>
      </div>
    </div>
  );
};

export default TutorCard;
