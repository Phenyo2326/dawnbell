
import React from "react";
import { Tutor } from "@/types/tutors";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSessionBooking } from "@/hooks/useSessionBooking";
import TutorCardHeader from "./tutor/TutorCardHeader";
import TutorSubjectTags from "./tutor/TutorSubjectTags";
import TutorCardFooter from "./tutor/TutorCardFooter";

interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard = ({ tutor }: TutorCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    isBooking,
    dialogOpen,
    setDialogOpen,
    handleBookSession,
    availableTimes
  } = useSessionBooking(tutor, () => setDialogOpen(false));

  return (
    <div className="tutor-card bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border">
      <div className="p-6">
        <TutorCardHeader 
          name={tutor.name}
          avatar={tutor.avatar}
          education={tutor.education}
          rating={tutor.rating}
          reviews={tutor.reviews}
        />

        <TutorSubjectTags subjects={tutor.subjects} limit={3} />
        
        <p className="text-sm mt-4 line-clamp-2">{tutor.description}</p>

        <TutorCardFooter 
          tutorId={tutor.id}
          hourlyRate={tutor.hourlyRate}
          availability={tutor.availability}
          tutorName={tutor.name}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          availableTimes={availableTimes}
          isBooking={isBooking}
          handleBookSession={handleBookSession}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />
      </div>
    </div>
  );
};

export default TutorCard;
