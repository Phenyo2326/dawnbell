
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock, GraduationCap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 px-6 bg-soft-purple">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 max-w-xl">
          <div className="inline-block px-3 py-1 rounded-full bg-secondary border text-sm font-medium">
            Elevate Your Learning Journey
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Learn Smarter with <span className="gradient-text">Dawnbell Academy</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Personalized online education tailored to your unique learning style. Connect with expert instructors and unlock your full potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="group">
              Explore Subjects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              Become a Learner
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>12+ Subjects</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>Expert Instructors</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Flexible Learning</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1517430816045-df4b7de275bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
              alt="Students learning together" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary rounded-full z-0"></div>
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary rounded-full z-0"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
