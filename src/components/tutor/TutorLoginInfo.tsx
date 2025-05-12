
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Tutor } from "@/types/tutors";

interface TutorLoginInfoProps {
  tutor: Tutor;
  showInfo?: boolean;
}

const TutorLoginInfo = ({ tutor, showInfo = false }: TutorLoginInfoProps) => {
  // Only show in development environment and if explicitly enabled
  if (process.env.NODE_ENV !== 'development' || !showInfo) {
    return null;
  }

  const tutorEmail = tutor.name.toLowerCase().replace(' ', '.') + '@dawnbell.edu';

  return (
    <Alert className="bg-blue-50 border-blue-200 mb-2">
      <InfoIcon className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-xs text-blue-800">
        <p><strong>Developer Note:</strong> To log in as this tutor:</p>
        <p>Email: {tutorEmail}</p>
        <p>Password: Dawnbell2023!</p>
      </AlertDescription>
    </Alert>
  );
};

export default TutorLoginInfo;
