
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-dietGreen">MyDietDiary</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-dietGreen transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-foreground hover:text-dietGreen transition-colors">
            About
          </Link>
          <Link to="/features" className="text-foreground hover:text-dietGreen transition-colors">
            Features
          </Link>
          <Link to="/login">
            <Button variant="outline" className="mr-2">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link to="/" className="text-foreground hover:text-dietGreen transition-colors px-2 py-1.5">
              Home
            </Link>
            <Link to="/about" className="text-foreground hover:text-dietGreen transition-colors px-2 py-1.5">
              About
            </Link>
            <Link to="/features" className="text-foreground hover:text-dietGreen transition-colors px-2 py-1.5">
              Features
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/login">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="w-full">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
