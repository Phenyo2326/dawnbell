
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import TutorBookingDialog from "./TutorBookingDialog";

interface TutorCardFooterProps {
  tutorId: number;
  hourlyRate: number;
  availability: string;
  // Booking dialog props
  tutorName: string;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  availableTimes: string[];
  isBooking: boolean;
  handleBookSession: () => Promise<void>;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

const TutorCardFooter = ({
  tutorId,
  hourlyRate,
  availability,
  tutorName,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  availableTimes,
  isBooking,
  handleBookSession,
  dialogOpen,
  setDialogOpen
}: TutorCardFooterProps) => {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-primary" />
          <span>{availability}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">${hourlyRate}/hr</span>
        </div>
      </div>
      
      <div className="flex border-t mt-4">
        <Button 
          className="flex-1 rounded-none" 
          variant="ghost"
          asChild
        >
          <Link to={`/tutor-profile/${tutorId}`}>
            View Profile
          </Link>
        </Button>
        
        <TutorBookingDialog
          tutorName={tutorName}
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
    </>
  );
};

export default TutorCardFooter;
