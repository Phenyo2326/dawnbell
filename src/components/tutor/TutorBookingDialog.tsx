
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface TutorBookingDialogProps {
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

const TutorBookingDialog = ({
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
}: TutorBookingDialogProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 rounded-none">
          Book Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book a Session with {tutorName}</DialogTitle>
          <DialogDescription>
            Select a date and time for your tutoring session
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
            className="rounded-md border pointer-events-auto"
            disabled={(date) => date < new Date()}
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
            {isBooking ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorBookingDialog;
