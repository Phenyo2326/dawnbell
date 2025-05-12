
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const TutorsList = () => {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        // Get all profiles with role = 'tutor'
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'tutor');

        if (error) {
          console.error('Error fetching tutors:', error);
          return;
        }

        setTutors(data || []);
      } catch (err) {
        console.error('Error in fetchTutors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Tutors</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading tutors...</p>
        ) : tutors.length > 0 ? (
          <div className="space-y-3">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{tutor.full_name}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {tutor.bio || "No bio available"}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {tutor.subjects?.map((subject: string, idx: number) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-secondary rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
                <div className="text-right mt-2">
                  <p className="text-xs text-blue-600">Email: {tutor.full_name.toLowerCase().replace(' ', '.')}@dawnbell.edu</p>
                  <p className="text-xs text-blue-600">Password: Dawnbell2023!</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tutors found</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TutorsList;
