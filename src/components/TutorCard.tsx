
import { Button } from "@/components/ui/button";
import { Star, Clock } from "lucide-react";
import { Tutor } from "@/types/tutors";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { addHours, format } from "date-fns";
import { Link } from "react-router-dom";

interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard = ({ tutor }: TutorCardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("9:00");
  const [isBooking, setIsBooking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const availableTimes = [
    "9:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const handleBookSession = async () => {
    if (!user || !selectedDate) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a date and time for your session."
      });
      return;
    }

    setIsBooking(true);
    try {
      // Parse the selected time to set hours and minutes
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const startTime = new Date(selectedDate);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = addHours(startTime, 1); // Default to 1-hour sessions

      // Check if we have subject data
      const subjectId = typeof tutor.subjects[0] === 'string' 
        ? tutor.subjects[0] 
        : String(tutor.subjects[0]);

      const { data, error } = await supabase
        .from('sessions')
        .insert({
          student_id: user.id,
          tutor_id: String(tutor.id),
          subject_id: subjectId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'pending',
          payment_status: 'pending'
        })
        .select();

      if (error) throw error;

      toast({
        title: "Session Booked!",
        description: `Your session with ${tutor.name} has been scheduled for ${format(startTime, 'PPP')} at ${format(startTime, 'p')}`
      });

      setSelectedDate(undefined);
      setDialogOpen(false);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "There was an error booking your session. Please try again."
      });
    } finally {
      setIsBooking(false);
    }
  };

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
        <Button 
          className="flex-1 rounded-none" 
          variant="ghost"
          asChild
        >
          <Link to={`/tutor-profile/${tutor.id}`}>
            View Profile
          </Link>
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1 rounded-none">
              Book Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book a Session with {tutor.name}</DialogTitle>
              <DialogDescription>
                Select a date and time for your tutoring session
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
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
      </div>
    </div>
  );
};

export default TutorCard;
