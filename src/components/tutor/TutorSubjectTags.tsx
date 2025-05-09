
import React from "react";

interface TutorSubjectTagsProps {
  subjects: string[];
  limit?: number;
}

const TutorSubjectTags = ({ subjects, limit = 3 }: TutorSubjectTagsProps) => {
  return (
    <div className="flex flex-wrap gap-1">
      {subjects.slice(0, limit).map((subject, index) => (
        <span 
          key={index} 
          className="text-xs px-2 py-1 bg-secondary rounded-full"
        >
          {subject}
        </span>
      ))}
    </div>
  );
};

export default TutorSubjectTags;
