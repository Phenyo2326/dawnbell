
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tutors } from "@/data/tutors";
import { Tutor } from "@/types/tutors";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, Clock, GraduationCap, Calendar as CalendarIcon, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { addHours, format } from "date-fns";

const TutorProfile = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Find the tutor based on the ID from URL params
    const foundTutor = tutors.find(t => t.id === Number(tutorId));
    
    if (!foundTutor) {
      navigate("/student-dashboard");
      return;
    }
    
    setTutor(foundTutor);
  }, [tutorId, navigate]);

  const handleBookSession = async () => {
    if (!user || !selectedDate || !tutor) return;

    setIsBooking(true);
    try {
      const startTime = selectedDate;
      const endTime = addHours(startTime, 1); // Default to 1-hour sessions

      const { data, error } = await supabase
        .from('sessions')
        .insert({
          student_id: user.id,
          tutor_id: String(tutor.id), // Convert to string
          subject_id: String(tutor.subjects[0]), // Convert to string since subject_id is a string in DB
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Session Booked!",
        description: `Your session with ${tutor.name} has been scheduled for ${format(startTime, 'PPP')} at ${format(startTime, 'p')}`
      });

      setSelectedDate(undefined);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "There was an error booking your session. Please try again."
      });
    } finally {
      setIsBooking(false);
    }
  };

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
          {/* Tutor header */}
          <div className="p-8 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-start gap-6">
              <img 
                src={tutor.avatar} 
                alt={`${tutor.name}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{tutor.name}</h1>
                <p className="text-lg text-muted-foreground">{tutor.education}</p>
                <div className="flex items-center mt-2 gap-2">
                  <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{tutor.rating}</span>
                    <span className="text-xs text-muted-foreground">({tutor.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{tutor.availability}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${tutor.hourlyRate}/hr</div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-2">
                      Book Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book a Session with {tutor.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border mx-auto pointer-events-auto"
                        disabled={(date) => date < new Date()}
                      />
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
          </div>

          {/* Tutor details */}
          <div>
            <Tabs defaultValue="about" className="p-6">
              <TabsList className="mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Biography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{tutor.description}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">{tutor.education}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="subjects">
                <Card>
                  <CardHeader>
                    <CardTitle>Subjects Taught</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                        <span className="text-xl font-bold">{tutor.rating}</span>
                        <span className="text-sm text-muted-foreground">({tutor.reviews} reviews)</span>
                      </div>
                      
                      <p className="text-muted-foreground">Detailed reviews coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
