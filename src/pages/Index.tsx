
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import RecipeGrid from "@/components/recipes/RecipeGrid";
import { recipeData } from "@/data/mockData";
import { usePantry } from "@/context/PantryContext";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChefHat, Refrigerator, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index: React.FC = () => {
  const { ingredients } = usePantry();
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <Layout showSearch onSearch={handleSearch}>
      <div className="flex flex-col space-y-8">
        <section className="text-center py-8 px-4 -mt-6 bg-gradient-to-br from-orange-50 to-lime-50 rounded-lg border">
          <ChefHat className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="font-display text-4xl font-bold mb-4">
            Find What to Cook With What You've Got
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Recipe Radar suggests meals based on ingredients you already have. No more trips to the store!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/pantry">
              <Button size="lg" className="gap-2">
                <Refrigerator className="h-5 w-5" />
                Manage Your Pantry
              </Button>
            </Link>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-semibold">Recipe Matches</h2>
          </div>

          {ingredients.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your pantry is empty! <Link to="/pantry" className="font-medium underline">Add some ingredients</Link> to see matching recipes.
              </AlertDescription>
            </Alert>
          ) : (
            <RecipeGrid recipes={recipeData} searchTerm={searchTerm} />
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
