
import { supabase } from "@/integrations/supabase/client";

// Fetch all pantry ingredients for the current user
export const fetchPantryIngredients = async () => {
  const { data, error } = await supabase
    .from("Pantry")
    .select("*");
    
  if (error) {
    console.error("Error fetching pantry items:", error);
    console.error("Error details:", error.details, error.hint, error.message);
    throw error;
  }

  console.log("Fetched data from Supabase:", data);
  
  // Transform Supabase data to match our existing format
  return data.map(item => ({
    id: item.id.toString(),
    name: item.ingredient_name || "",
    category: item.category || "",
    amount: item.QuantityUnit || "",
  }));
};

// Add a new ingredient to the pantry
export const addPantryIngredient = async (ingredient) => {
  console.log("Adding ingredient to Supabase:", ingredient);
  
  const { data, error } = await supabase
    .from("Pantry")
    .insert({
      ingredient_name: ingredient.name.trim(),
      category: ingredient.category,
      QuantityUnit: ingredient.amount,
      user_id: 1, // Using test user ID
    })
    .select();
  
  if (error) {
    console.error("Error adding ingredient:", error);
    console.error("Error details:", error.details, error.hint, error.message);
    throw error;
  }
  
  console.log("Supabase response after insert:", data);
  
  // Return the newly added ingredient with the ID from Supabase
  return {
    id: data[0].id.toString(),
    name: data[0].ingredient_name,
    category: data[0].category,
    amount: data[0].QuantityUnit,
  };
};

// Remove an ingredient from the pantry
export const removePantryIngredient = async (id) => {
  const { error } = await supabase
    .from("Pantry")
    .delete()
    .eq("id", parseInt(id));
  
  if (error) {
    console.error("Error removing ingredient:", error);
    console.error("Error details:", error.details, error.hint, error.message);
    throw error;
  }
};

// Update an existing ingredient
export const updatePantryIngredient = async (id, updatedFields) => {
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
    console.error("Error details:", error.details, error.hint, error.message);
    throw error;
  }
};

// Clear all ingredients from the pantry
export const clearPantryIngredients = async () => {
  const { error } = await supabase
    .from("Pantry")
    .delete()
    .eq("user_id", 1);
  
  if (error) {
    console.error("Error clearing pantry:", error);
    console.error("Error details:", error.details, error.hint, error.message);
    throw error;
  }
};
