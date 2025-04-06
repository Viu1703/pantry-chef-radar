
import React from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showSearch?: boolean;
  onSearch?: (term: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  showSearch = false,
  onSearch 
}) => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link to="/" className="text-lg font-medium hover:text-primary">
                      Home
                    </Link>
                    <Link to="/pantry" className="text-lg font-medium hover:text-primary">
                      My Pantry
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            <Link to="/" className="flex items-center gap-1">
              <span className="text-2xl font-display font-bold text-primary">Recipe Radar</span>
            </Link>
          </div>
          
          {!isMobile && (
            <nav className="mx-6 flex items-center space-x-6 text-sm font-medium">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/pantry" className="hover:text-primary transition-colors">
                My Pantry
              </Link>
            </nav>
          )}

          {showSearch && (
            <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
              <Input
                type="search"
                placeholder="Search recipes..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </form>
          )}
        </div>
      </header>
      
      <main className="flex-1">
        {title && (
          <div className="border-b bg-secondary/30">
            <div className="container py-8">
              <h1 className="text-3xl font-display font-semibold">{title}</h1>
            </div>
          </div>
        )}
        <div className="container py-6">{children}</div>
      </main>
      
      <footer className="border-t py-6 bg-muted/30">
        <div className="container flex flex-col items-center justify-center gap-2 text-center md:flex-row md:gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Recipe Radar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
