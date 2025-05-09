
import React from "react";
import { Star } from "lucide-react";

interface TutorCardHeaderProps {
  name: string;
  avatar: string;
  education: string;
  rating: number;
  reviews: number;
}

const TutorCardHeader = ({ 
  name, 
  avatar, 
  education, 
  rating, 
  reviews 
}: TutorCardHeaderProps) => {
  return (
    <div className="flex items-start gap-4">
      <img 
        src={avatar} 
        alt={`${name}'s profile picture`}
        className="w-16 h-16 rounded-full object-cover border-2 border-primary"
      />
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{education}</p>
      </div>
      <div className="tutor-rating flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        <span className="font-medium">{rating}</span>
        <span className="text-xs text-muted-foreground">({reviews})</span>
      </div>
    </div>
  );
};

export default TutorCardHeader;
