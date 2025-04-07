
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <ChefHat className="mx-auto h-20 w-20 text-muted-foreground mb-4" />
        <h1 className="text-6xl font-display font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! This recipe seems to be missing from our cookbook.
        </p>
        <Link to="/">
          <Button className="mx-auto">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
