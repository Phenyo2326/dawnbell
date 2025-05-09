
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tutors } from "@/data/tutors";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog } from "@/components/ui/dialog";
import TutorHeader from "@/components/tutor/TutorHeader";
import TutorBookingModal from "@/components/tutor/TutorBookingModal";
import TutorDetailTabs from "@/components/tutor/TutorDetailTabs";
import { useSessionBooking } from "@/hooks/useSessionBooking";

const TutorProfile = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  // Use our custom hook for session booking logic
  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    isBooking,
    fetchBookedSessions,
    handleBookSession,
    availableTimes
  } = useSessionBooking(tutor, () => setDialogOpen(false));

  useEffect(() => {
    // Find the tutor based on the ID from URL params
    const foundTutor = tutors.find(t => t.id === Number(tutorId));
    
    if (!foundTutor) {
      navigate("/student-dashboard");
      return;
    }
    
    setTutor(foundTutor);

    // Fetch booked sessions for this tutor
    if (foundTutor) {
      fetchBookedSessions(tutorId);
    }
  }, [tutorId, navigate, fetchBookedSessions]);

  if (!tutor) {
    return <div className="p-8 text-center">Loading tutor profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline"
          onClick={() => navigate("/student-dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tutor header component */}
          <TutorHeader 
            tutor={tutor}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
          />

          {/* Booking modal */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <TutorBookingModal 
              tutor={tutor}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              isBooking={isBooking}
              handleBookSession={handleBookSession}
              availableTimes={availableTimes}
            />
          </Dialog>

          {/* Tutor details tabs */}
          <TutorDetailTabs tutor={tutor} />
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
