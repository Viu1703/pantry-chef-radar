
import React from "react";
import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Recipe } from "@/data/mockData";

interface RecipeCardProps {
  recipe: Recipe;
  matchedIngredients?: string[];
  missingIngredients?: string[];
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  matchedIngredients = [], 
  missingIngredients = [] 
}) => {
  const matchPercentage = Math.round((matchedIngredients.length / recipe.ingredients.length) * 100);
  
  return (
    <Link to={`/recipe/${recipe.id}`} className="block">
      <Card className="recipe-card h-full overflow-hidden flex flex-col">
        <div className="aspect-video relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          {matchedIngredients.length > 0 && (
            <div className="absolute top-3 right-3">
              <Badge className={`text-white ${matchPercentage === 100 ? 'bg-lime-500' : 'bg-orange-500'}`}>
                {matchPercentage === 100 ? "Perfect Match!" : `${matchPercentage}% Match`}
              </Badge>
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-medium">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          {matchedIngredients.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {missingIngredients.length > 0 ? "Ingredients you have:" : "You have all ingredients!"}
              </p>
              <div className="flex flex-wrap gap-1">
                {matchedIngredients.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary" className="text-xs">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {missingIngredients.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Missing ingredients:</p>
              <div className="flex flex-wrap gap-1">
                {missingIngredients.map((ingredient) => (
                  <Badge key={ingredient} variant="outline" className="text-xs border-orange-300 text-orange-700">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t bg-muted/20 py-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RecipeCard;
