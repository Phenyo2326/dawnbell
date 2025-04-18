
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 lg:px-8 border-b backdrop-blur-sm bg-white/80 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl gradient-text">Dawnbell Academy</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-primary transition-colors">Courses</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Instructors</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Learning Paths</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Resources</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button>Join Now</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg z-50 border-b animate-fade-in">
          <div className="flex flex-col py-4 px-8 space-y-4">
            <a href="#" className="text-foreground hover:text-primary py-2 transition-colors">Courses</a>
            <a href="#" className="text-foreground hover:text-primary py-2 transition-colors">Instructors</a>
            <a href="#" className="text-foreground hover:text-primary py-2 transition-colors">Learning Paths</a>
            <a href="#" className="text-foreground hover:text-primary py-2 transition-colors">Resources</a>
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/login">
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full">Join Now</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
