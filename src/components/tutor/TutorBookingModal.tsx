
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tutor } from "@/types/tutors";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
  const { user } = useAuth();

  // Display tutor login credentials if we're on the local development environment
  const showDevCredentials = process.env.NODE_ENV === 'development';

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Book a Session with {tutor.name}</DialogTitle>
        <DialogDescription>
          {user 
            ? "Sessions are 1 hour long. Select a date and time to request a session. Your request will be pending until the tutor accepts it."
            : "You'll need to log in before booking a session"}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        {showDevCredentials && (
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-xs text-blue-800">
              <p><strong>Developer Note:</strong> To log in as this tutor:</p>
              <p>Email: {tutor.name.toLowerCase().replace(' ', '.')}@dawnbell.edu</p>
              <p>Password: Dawnbell2023!</p>
            </AlertDescription>
          </Alert>
        )}

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
          {isBooking ? "Sending Request..." : user ? "Request Session" : "Sign In & Book"}
        </Button>
      </div>
    </DialogContent>
  );
};

export default TutorBookingModal;
