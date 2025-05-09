
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tutor } from "@/types/tutors";
import { format } from "date-fns";

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
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Book a Session with {tutor.name}</DialogTitle>
        <DialogDescription>
          Sessions are 1 hour long. Select a date and time to request a session.
          Your request will be pending until the tutor accepts it.
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
            return isPast;
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
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleBookSession}
          disabled={!selectedDate || isBooking}
        >
          {isBooking ? "Sending Request..." : "Request Session"}
        </Button>
      </div>
    </DialogContent>
  );
};

export default TutorBookingModal;
