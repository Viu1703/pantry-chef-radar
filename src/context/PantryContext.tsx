
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type Ingredient = {
  id: string;
  name: string;
  category: string;
  amount?: string;
};

type PantryContextType = {
  ingredients: Ingredient[];
  addIngredient: (ingredient: Omit<Ingredient, "id">) => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, ingredient: Partial<Ingredient>) => void;
  clearPantry: () => void;
};

const PantryContext = createContext<PantryContextType | undefined>(undefined);

export const usePantry = () => {
  const context = useContext(PantryContext);
  if (context === undefined) {
    throw new Error("usePantry must be used within a PantryProvider");
  }
  return context;
};

export const PantryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const savedIngredients = localStorage.getItem("pantry");
    return savedIngredients ? JSON.parse(savedIngredients) : [];
  });
  
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("pantry", JSON.stringify(ingredients));
  }, [ingredients]);

  const addIngredient = (ingredient: Omit<Ingredient, "id">) => {
    const newIngredient = {
      ...ingredient,
      id: Date.now().toString(),
    };
    
    // Make ingredient name lowercase for consistency in matching
    const normalizedName = ingredient.name.trim().toLowerCase();
    
    // Check if ingredient already exists (case insensitive)
    if (ingredients.some(ing => ing.name.toLowerCase() === normalizedName)) {
      toast({
        title: "Ingredient already exists",
        description: `${ingredient.name} is already in your pantry.`,
        variant: "destructive",
      });
      return;
    }
    
    // Store the ingredient with original casing but trimmed
    setIngredients([...ingredients, {
      ...newIngredient,
      name: ingredient.name.trim()
    }]);
    
    toast({
      title: "Ingredient added",
      description: `${newIngredient.name} has been added to your pantry.`,
    });
  };

  const removeIngredient = (id: string) => {
    const ingredient = ingredients.find(ing => ing.id === id);
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    
    if (ingredient) {
      toast({
        title: "Ingredient removed",
        description: `${ingredient.name} has been removed from your pantry.`,
      });
    }
  };

  const updateIngredient = (id: string, updatedFields: Partial<Ingredient>) => {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, ...updatedFields } : ingredient
      )
    );
    
    toast({
      title: "Ingredient updated",
      description: "Your pantry has been updated.",
    });
  };

  const clearPantry = () => {
    setIngredients([]);
    toast({
      title: "Pantry cleared",
      description: "All ingredients have been removed from your pantry.",
    });
  };

  return (
    <PantryContext.Provider
      value={{
        ingredients,
        addIngredient,
        removeIngredient,
        updateIngredient,
        clearPantry,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
};
