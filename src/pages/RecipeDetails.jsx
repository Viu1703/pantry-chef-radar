
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { recipeData } from "@/data/mockData";
import { usePantry } from "@/context/PantryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChevronLeft, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ingredients } = usePantry();
  
  const recipe = recipeData.find((r) => r.id === id);
  
  if (!recipe) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Recipe not found</h2>
          <p className="text-muted-foreground mb-6">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")}>Back to Recipes</Button>
        </div>
      </Layout>
    );
  }
  
  const pantryIngredients = ingredients.map(ing => ing.name.toLowerCase());
  const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
  
  const matchedIngredients = recipeIngredients.filter(ing => 
    pantryIngredients.some(pantryIng => pantryIng.includes(ing) || ing.includes(pantryIng))
  );
  
  const missingIngredients = recipeIngredients.filter(ing => 
    !pantryIngredients.some(pantryIng => pantryIng.includes(ing) || ing.includes(pantryIng))
  );
  
  const matchPercentage = Math.round((matchedIngredients.length / recipeIngredients.length) * 100);

  return (
    <Layout>
      <Button 
        variant="ghost" 
        className="mb-6 pl-2" 
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="rounded-lg overflow-hidden mb-6">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full aspect-video object-cover"
            />
          </div>
          
          <h1 className="text-3xl font-display font-semibold mb-2">{recipe.title}</h1>
          <p className="text-muted-foreground mb-4">{recipe.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          
          <div className="flex gap-6 mb-6">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Prep Time</p>
                <p className="text-muted-foreground">{recipe.prepTime} min</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Cook Time</p>
                <p className="text-muted-foreground">{recipe.cookTime} min</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Servings</p>
                <p className="text-muted-foreground">{recipe.servings}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Pantry Match</h2>
              
              <div className="mb-4">
                <div className="relative w-full h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${
                      matchPercentage === 100 ? 'bg-lime-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${matchPercentage}%` }}
                  ></div>
                </div>
                <p className="text-center mt-2 text-sm font-medium">
                  {matchPercentage === 100 
                    ? "Perfect Match! You have all ingredients." 
                    : `${matchPercentage}% Match - You have ${matchedIngredients.length} of ${recipe.ingredients.length} ingredients`
                  }
                </p>
              </div>
              
              {matchedIngredients.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Ingredients You Have:</h3>
                  <ul className="space-y-1">
                    {matchedIngredients.map(ing => (
                      <li key={ing} className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-lime-500" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {missingIngredients.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Missing Ingredients:</h3>
                  <ul className="space-y-1">
                    {missingIngredients.map(ing => (
                      <li key={ing} className="flex items-center text-sm">
                        <X className="h-4 w-4 mr-2 text-orange-500" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-display font-medium mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block h-2 w-2 rounded-full bg-primary mt-2 mr-3"></span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-display font-medium mb-4">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary text-sm font-medium mr-3 shrink-0">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetails;
