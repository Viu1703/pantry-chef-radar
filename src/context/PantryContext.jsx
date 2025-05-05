
import React, { createContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  fetchPantryIngredients, 
  addPantryIngredient, 
  removePantryIngredient, 
  updatePantryIngredient, 
  clearPantryIngredients 
} from "@/services/pantryService";

// Create context
export const PantryContext = createContext(undefined);

// Export usePantry from the separate hook file
export { usePantry } from "@/hooks/usePantryContext";

export const PantryProvider = ({ children }) => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch ingredients from CSV on component mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setLoading(true);
        const formattedData = await fetchPantryIngredients();
        setIngredients(formattedData);
      } catch (error) {
        toast({
          title: "Error loading pantry",
          description: "Could not load your ingredients. Please try again later.",
          variant: "destructive",
        });
        console.error("Error loading ingredients:", error);
      } finally {
        setLoading(false);
      }
    };

    loadIngredients();
  }, [toast]);

  // Add a new ingredient to the pantry
  const addIngredient = async (ingredient) => {
    try {
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
      
      const newIngredient = await addPantryIngredient(ingredient);
      setIngredients([...ingredients, newIngredient]);
      
      toast({
        title: "Ingredient added",
        description: `${newIngredient.name} has been added to your pantry.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding ingredient:", error);
    }
  };

  // Remove an ingredient from the pantry
  const removeIngredient = async (id) => {
    try {
      const ingredient = ingredients.find(ing => ing.id === id);
      
      await removePantryIngredient(id);
      
      // Update local state
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
      
      if (ingredient) {
        toast({
          title: "Ingredient removed",
          description: `${ingredient.name} has been removed from your pantry.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Error removing ingredient:", error);
    }
  };

  // Update an existing ingredient
  const updateIngredient = async (id, updatedFields) => {
    try {
      await updatePantryIngredient(id, updatedFields);
      
      // Update local state
      setIngredients(
        ingredients.map((ingredient) =>
          ingredient.id === id ? { ...ingredient, ...updatedFields } : ingredient
        )
      );
      
      toast({
        title: "Ingredient updated",
        description: "Your pantry has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating ingredient:", error);
    }
  };

  // Clear all ingredients from the pantry
  const clearPantry = async () => {
    try {
      await clearPantryIngredients();
      
      // Clear local state
      setIngredients([]);
      
      toast({
        title: "Pantry cleared",
        description: "All ingredients have been removed from your pantry.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Error clearing pantry:", error);
    }
  };

  return (
    <PantryContext.Provider
      value={{
        ingredients,
        loading,
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
