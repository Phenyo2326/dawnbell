
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Tutor } from "@/types/tutors";

interface TutorLoginInfoProps {
  tutor: Tutor;
  showInfo?: boolean;
}

const TutorLoginInfo = ({ tutor, showInfo = false }: TutorLoginInfoProps) => {
  // This component is now empty - we don't show login credentials anymore
  return null;
};

export default TutorLoginInfo;
