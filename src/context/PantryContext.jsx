
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PantryContext = createContext(undefined);

export const usePantry = () => {
  const context = useContext(PantryContext);
  if (context === undefined) {
    throw new Error("usePantry must be used within a PantryProvider");
  }
  return context;
};

export const PantryProvider = ({ children }) => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch ingredients from Supabase on component mount
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Pantry")
          .select("*");
          
        if (error) {
          console.error("Error fetching pantry items:", error);
          toast({
            title: "Error loading pantry",
            description: "Could not load your ingredients. Please try again later.",
            variant: "destructive",
          });
          return;
        }

        // Transform Supabase data to match our existing format
        const formattedData = data.map(item => ({
          id: item.id.toString(),
          name: item.ingredient_name || "",
          category: item.category || "",
          amount: item.QuantityUnit || "",
        }));

        setIngredients(formattedData);
      } catch (error) {
        console.error("Error in fetchIngredients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [toast]);

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
      
      // Insert to Supabase
      const { data, error } = await supabase
        .from("Pantry")
        .insert({
          ingredient_name: ingredient.name.trim(),
          category: ingredient.category,
          QuantityUnit: ingredient.amount,
        })
        .select();
      
      if (error) {
        console.error("Error adding ingredient:", error);
        toast({
          title: "Error adding ingredient",
          description: "Could not add the ingredient. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Add to local state with ID from Supabase
      const newIngredient = {
        id: data[0].id.toString(),
        name: data[0].ingredient_name,
        category: data[0].category,
        amount: data[0].QuantityUnit,
      };
      
      setIngredients([...ingredients, newIngredient]);
      
      toast({
        title: "Ingredient added",
        description: `${newIngredient.name} has been added to your pantry.`,
      });
    } catch (error) {
      console.error("Error in addIngredient:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeIngredient = async (id) => {
    try {
      const ingredient = ingredients.find(ing => ing.id === id);
      
      // Delete from Supabase
      const { error } = await supabase
        .from("Pantry")
        .delete()
        .eq("id", parseInt(id));
      
      if (error) {
        console.error("Error removing ingredient:", error);
        toast({
          title: "Error removing ingredient",
          description: "Could not remove the ingredient. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
      
      if (ingredient) {
        toast({
          title: "Ingredient removed",
          description: `${ingredient.name} has been removed from your pantry.`,
        });
      }
    } catch (error) {
      console.error("Error in removeIngredient:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateIngredient = async (id, updatedFields) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from("Pantry")
        .update({
          ingredient_name: updatedFields.name,
          category: updatedFields.category,
          QuantityUnit: updatedFields.amount,
        })
        .eq("id", parseInt(id));
      
      if (error) {
        console.error("Error updating ingredient:", error);
        toast({
          title: "Error updating ingredient",
          description: "Could not update the ingredient. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
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
      console.error("Error in updateIngredient:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearPantry = async () => {
    try {
      // Delete all pantry items from Supabase
      // Note: This should be handled with caution and might require more security
      const { error } = await supabase
        .from("Pantry")
        .delete()
        .in("id", ingredients.map(ing => parseInt(ing.id)));
      
      if (error) {
        console.error("Error clearing pantry:", error);
        toast({
          title: "Error clearing pantry",
          description: "Could not clear your pantry. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Clear local state
      setIngredients([]);
      
      toast({
        title: "Pantry cleared",
        description: "All ingredients have been removed from your pantry.",
      });
    } catch (error) {
      console.error("Error in clearPantry:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
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
