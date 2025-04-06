
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import RecipeGrid from "@/components/recipes/RecipeGrid";
import { recipeData } from "@/data/mockData";
import { usePantry } from "@/context/PantryContext";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChefHat, Refrigerator, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Index: React.FC = () => {
  const { ingredients } = usePantry();
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState("");
  const [searchByIngredient, setSearchByIngredient] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Extract all unique ingredients from recipes
  const allIngredients = Array.from(
    new Set(
      recipeData.flatMap(recipe => 
        recipe.ingredients.map(ing => ing.toLowerCase())
      )
    )
  ).sort();
  
  // Handle search by title/tags
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchByIngredient(false);
  };

  // Handle search by ingredient
  const handleIngredientSearch = (ingredient: string) => {
    setIngredientSearchTerm(ingredient);
    setSearchByIngredient(true);
    setOpen(false);
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
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2">
                  <Search className="h-5 w-5" />
                  Search by Ingredient
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Type an ingredient..." 
                    value={ingredientSearchTerm}
                    onValueChange={setIngredientSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>No ingredients found.</CommandEmpty>
                    <CommandGroup>
                      {allIngredients
                        .filter(ing => ing.includes(ingredientSearchTerm.toLowerCase()))
                        .slice(0, 10)
                        .map(ingredient => (
                          <CommandItem 
                            key={ingredient} 
                            onSelect={() => handleIngredientSearch(ingredient)}
                          >
                            {ingredient}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {searchByIngredient && ingredientSearchTerm && (
            <div className="mt-4 inline-flex items-center bg-primary/10 py-1 px-3 rounded-full text-sm">
              Searching for recipes with: <span className="font-semibold ml-1">{ingredientSearchTerm}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 ml-2" 
                onClick={() => {
                  setSearchByIngredient(false);
                  setIngredientSearchTerm("");
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-semibold">Recipe Matches</h2>
          </div>

          {ingredients.length === 0 && !searchByIngredient ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your pantry is empty! <Link to="/pantry" className="font-medium underline">Add some ingredients</Link> to see matching recipes.
              </AlertDescription>
            </Alert>
          ) : (
            <RecipeGrid 
              recipes={recipeData} 
              searchTerm={searchTerm} 
              ingredientSearchTerm={searchByIngredient ? ingredientSearchTerm : undefined}
            />
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
