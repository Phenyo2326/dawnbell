
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tutor } from "@/types/tutors";
import { GraduationCap, Star, CalendarIcon } from "lucide-react";

interface TutorDetailTabsProps {
  tutor: Tutor;
}

const TutorDetailTabs = ({ tutor }: TutorDetailTabsProps) => {
  return (
    <Tabs defaultValue="about" className="p-6">
      <TabsList className="mb-6">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="subjects">Subjects</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="availability">Availability</TabsTrigger>
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
      
      <TabsContent value="availability">
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {tutor.availability}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span className="font-medium">Booking Status Legend:</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-300 rounded-full"></span>
                  <span>Pending approval</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Confirmed sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  <span>Unavailable time slots</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TutorDetailTabs;
