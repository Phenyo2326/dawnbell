
import React from "react";
import { Button } from "@/components/ui/button";
import { Tutor } from "@/types/tutors";
import { Star, Clock } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface TutorHeaderProps {
  tutor: Tutor;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

const TutorHeader = ({ tutor, dialogOpen, setDialogOpen }: TutorHeaderProps) => {
  return (
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-2">
                Book Session
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default TutorHeader;
