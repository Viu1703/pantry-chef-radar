
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import RecipeGrid from "@/components/recipes/RecipeGrid";
import { recipeData } from "@/data/mockData";
import { usePantry } from "@/context/PantryContext";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChefHat, Refrigerator, Search, X, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Index: React.FC = () => {
  const { ingredients } = usePantry();
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState("");
  const [activeIngredientFilters, setActiveIngredientFilters] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [filterByPantry, setFilterByPantry] = useState(true);
  
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
  };

  // Handle adding ingredient filter
  const handleAddIngredientFilter = (ingredient: string) => {
    if (!activeIngredientFilters.includes(ingredient)) {
      setActiveIngredientFilters([...activeIngredientFilters, ingredient]);
    }
    setIngredientSearchTerm("");
    setOpen(false);
  };

  // Handle removing ingredient filter
  const handleRemoveIngredientFilter = (ingredient: string) => {
    setActiveIngredientFilters(activeIngredientFilters.filter(ing => ing !== ingredient));
  };

  // Clear all ingredient filters
  const clearIngredientFilters = () => {
    setActiveIngredientFilters([]);
  };

  // Create a combined ingredient search term
  const combinedIngredientSearchTerm = activeIngredientFilters.length > 0 
    ? activeIngredientFilters.join("|") 
    : "";

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
          <div className="flex justify-center gap-4 flex-wrap mb-4">
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
              <PopoverContent className="p-0" align="start" sideOffset={4} width={300}>
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
                        .filter(ing => 
                          ing.includes(ingredientSearchTerm.toLowerCase()) && 
                          !activeIngredientFilters.includes(ing)
                        )
                        .slice(0, 10)
                        .map(ingredient => (
                          <CommandItem 
                            key={ingredient} 
                            onSelect={() => handleAddIngredientFilter(ingredient)}
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
          
          {/* Ingredients filters */}
          {activeIngredientFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {activeIngredientFilters.map(ingredient => (
                <Badge key={ingredient} variant="secondary" className="px-3 py-1">
                  {ingredient}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 ml-1 p-0" 
                    onClick={() => handleRemoveIngredientFilter(ingredient)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))}
              {activeIngredientFilters.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs" 
                  onClick={clearIngredientFilters}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
          
          {/* Filter by pantry toggle */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Switch 
              id="filter-by-pantry" 
              checked={filterByPantry} 
              onCheckedChange={setFilterByPantry}
            />
            <Label htmlFor="filter-by-pantry" className="cursor-pointer">
              Prioritize recipes with ingredients in your pantry
            </Label>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-semibold">Recipe Matches</h2>
            {activeIngredientFilters.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Filtered by {activeIngredientFilters.length} ingredient{activeIngredientFilters.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {ingredients.length === 0 && activeIngredientFilters.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your pantry is empty! <Link to="/pantry" className="font-medium underline">Add some ingredients</Link> to see matching recipes, or search by specific ingredients above.
              </AlertDescription>
            </Alert>
          ) : (
            <RecipeGrid 
              recipes={recipeData} 
              searchTerm={searchTerm} 
              ingredientSearchTerm={combinedIngredientSearchTerm}
              filterByPantry={filterByPantry}
            />
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
