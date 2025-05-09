
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { addHours, format } from "date-fns";
import { Tutor } from "@/types/tutors";
import { useNavigate } from "react-router-dom";

export const useSessionBooking = (tutor: Tutor | null, onComplete?: () => void) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("9:00");
  const [isBooking, setIsBooking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookedSessions, setBookedSessions] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const availableTimes = [
    "9:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const fetchBookedSessions = async (tutorId: string | number) => {
    if (!tutorId) return;
    
    const { data, error } = await supabase
      .from('sessions')
      .select('start_time, end_time, status')
      .eq('tutor_id', String(tutorId))
      .neq('status', 'cancelled');
    
    if (!error && data) {
      setBookedSessions(data);
    }
  };

  const handleBookSession = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to book a session."
      });
      // Redirect to login page
      navigate("/login");
      return;
    }
    
    if (!selectedDate || !tutor) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a date for your session."
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

      console.log("Booking session with:", {
        student_id: user.id,
        tutor_id: String(tutor.id),
        subject_id: subjectId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      });

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

      if (error) {
        console.error("Booking insertion error:", error);
        throw error;
      }

      toast({
        title: "Session Request Sent!",
        description: `Your session with ${tutor.name} has been requested for ${format(startTime, 'PPP')} at ${format(startTime, 'p')}. Wait for tutor confirmation.`
      });

      setSelectedDate(undefined);
      
      // Refresh booked sessions
      fetchBookedSessions(tutor.id);
      
      if (onComplete) {
        onComplete();
      }
      
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

  // Function to check if a date is already booked
  const isDateBooked = (date: Date) => {
    return bookedSessions.some(session => {
      const sessionStart = new Date(session.start_time);
      const sessionEnd = new Date(session.end_time);
      
      // Check if the date falls within any booked session
      const startHour = date.getHours();
      const sessionStartHour = sessionStart.getHours();
      
      return date.toDateString() === sessionStart.toDateString() && 
             startHour === sessionStartHour;
    });
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    isBooking,
    dialogOpen,
    setDialogOpen,
    bookedSessions,
    fetchBookedSessions,
    handleBookSession,
    isDateBooked,
    availableTimes
  };
};
