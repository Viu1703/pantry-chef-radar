
import React from "react";
import RecipeCard from "./RecipeCard";
import { Recipe } from "@/data/mockData";
import { usePantry } from "@/context/PantryContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecipeGridProps {
  recipes: Recipe[];
  searchTerm?: string;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, searchTerm = "" }) => {
  const { ingredients } = usePantry();
  const pantryIngredients = ingredients.map(ing => ing.name.toLowerCase());
  
  // Filter recipes by search term if provided
  const filteredRecipes = recipes.filter(recipe => 
    searchTerm === "" || 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Calculate recipe matches
  const recipesWithMatches = filteredRecipes.map(recipe => {
    const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
    
    const matched = recipeIngredients.filter(ing => 
      pantryIngredients.some(pantryIng => pantryIng.includes(ing) || ing.includes(pantryIng))
    );
    
    const missing = recipeIngredients.filter(ing => 
      !pantryIngredients.some(pantryIng => pantryIng.includes(ing) || ing.includes(pantryIng))
    );
    
    const matchPercentage = (matched.length / recipeIngredients.length) * 100;
    
    return {
      recipe,
      matched,
      missing,
      matchPercentage
    };
  });
  
  // Sort recipes by match percentage (highest first)
  const sortedRecipes = [...recipesWithMatches].sort((a, b) => 
    b.matchPercentage - a.matchPercentage
  );

  if (filteredRecipes.length === 0) {
    return (
      <Alert className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No recipes found. Try adjusting your search.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedRecipes.map(({ recipe, matched, missing }) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          matchedIngredients={matched} 
          missingIngredients={missing}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
