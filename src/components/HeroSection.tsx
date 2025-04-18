
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Clock, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 max-w-xl">
          <div className="inline-block px-3 py-1 rounded-full bg-secondary border text-sm font-medium">
            Find Your Perfect Tutor Today
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Expert tutoring, <span className="gradient-text">tailored for you</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with qualified tutors in any subject, set your own schedule, and achieve your learning goals faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="group">
              Find a tutor
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              Become a tutor
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>4.8/5 average rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              <span>30+ subjects</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Flexible scheduling</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
              alt="Student learning with tutor" 
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
