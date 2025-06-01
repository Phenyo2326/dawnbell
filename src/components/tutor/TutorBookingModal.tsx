
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tutor } from "@/types/tutors";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface TutorBookingModalProps {
  tutor: Tutor;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  isBooking: boolean;
  handleBookSession: () => Promise<void>;
  availableTimes: string[];
}

const TutorBookingModal = ({
  tutor,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  isBooking,
  handleBookSession,
  availableTimes
}: TutorBookingModalProps) => {
  const { user, session } = useAuth();

  const isAuthenticated = user && session;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Book a Session with {tutor.name}</DialogTitle>
        <DialogDescription>
          {isAuthenticated
            ? "Sessions are 1 hour long. Select a date and time to request a session. Your request will be pending until the tutor accepts it."
            : "You need to be signed in to book a session. Please sign in first."}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            console.log("Selected date:", date);
            setSelectedDate(date);
          }}
          className="rounded-md border mx-auto pointer-events-auto"
          disabled={(date) => {
            const now = new Date();
            const isPast = date < now;
            return isPast || !isAuthenticated;
          }}
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Time</label>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
              <Button
                key={time}
                type="button"
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => setSelectedTime(time)}
                size="sm"
                disabled={!isAuthenticated}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleBookSession}
          disabled={!selectedDate || isBooking || !isAuthenticated}
        >
          {isBooking ? "Sending Request..." : 
           !isAuthenticated ? "Please Sign In First" : 
           "Request Session"}
        </Button>
        
        {!isAuthenticated && (
          <p className="text-sm text-gray-600 text-center">
            You need to be signed in to book sessions. Please refresh the page and sign in.
          </p>
        )}
      </div>
    </DialogContent>
  );
};

export default TutorBookingModal;
