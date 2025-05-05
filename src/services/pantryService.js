
import { supabase } from "@/integrations/supabase/client";

// Node class for linked list implementation
class IngredientNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// Linked List implementation for ingredients
class IngredientLinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Add an ingredient to linked list
  add(data) {
    const newNode = new IngredientNode(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
    return data;
  }

  // Convert linked list to array
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  // Find an ingredient by id
  findById(id) {
    let current = this.head;
    while (current) {
      if (current.data.id.toString() === id.toString()) {
        return current.data;
      }
      current = current.next;
    }
    return null;
  }
}

// Tree node implementation for category organization
class CategoryTreeNode {
  constructor(category) {
    this.category = category;
    this.ingredients = [];
    this.children = [];
  }

  addIngredient(ingredient) {
    this.ingredients.push(ingredient);
  }

  addChild(childNode) {
    this.children.push(childNode);
  }
}

// Simple Graph implementation for ingredient relationships
class IngredientGraph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(ingredient) {
    if (!this.adjacencyList.has(ingredient.id)) {
      this.adjacencyList.set(ingredient.id, []);
    }
  }
  
  addEdge(ingredient1, ingredient2) {
    if (!this.adjacencyList.has(ingredient1.id)) {
      this.addVertex(ingredient1);
    }
    if (!this.adjacencyList.has(ingredient2.id)) {
      this.addVertex(ingredient2);
    }
    this.adjacencyList.get(ingredient1.id).push(ingredient2.id);
    this.adjacencyList.get(ingredient2.id).push(ingredient1.id);
  }

  // Find related ingredients by category
  findRelatedIngredients(ingredient, allIngredients) {
    const relations = this.adjacencyList.get(ingredient.id) || [];
    return relations.map(relatedId => 
      allIngredients.find(ing => ing.id.toString() === relatedId.toString())
    );
  }
}

// Stack implementation using array
class IngredientStack {
  constructor() {
    this.items = [];
  }
  
  push(ingredient) {
    this.items.push(ingredient);
  }
  
  pop() {
    if (this.items.length === 0) return null;
    return this.items.pop();
  }
  
  peek() {
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
  
  toArray() {
    return [...this.items];
  }
}

// Queue implementation using array
class IngredientQueue {
  constructor() {
    this.items = [];
  }
  
  enqueue(ingredient) {
    this.items.push(ingredient);
  }
  
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }
  
  front() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
  
  toArray() {
    return [...this.items];
  }
}

// In-memory cache using our data structures
const pantryCache = {
  ingredientList: new IngredientLinkedList(),
  categoryTree: new Map(),
  ingredientStack: new IngredientStack(),
  ingredientQueue: new IngredientQueue(),
  ingredientGraph: new IngredientGraph(),
  initialized: false
};

// Helper to build category tree
const buildCategoryTree = (ingredients) => {
  pantryCache.categoryTree.clear();
  
  ingredients.forEach(ingredient => {
    if (!ingredient.category) return;
    
    if (!pantryCache.categoryTree.has(ingredient.category)) {
      pantryCache.categoryTree.set(ingredient.category, new CategoryTreeNode(ingredient.category));
    }
    
    const categoryNode = pantryCache.categoryTree.get(ingredient.category);
    categoryNode.addIngredient(ingredient);
  });
  
  // Build relationships between similar categories
  const categories = Array.from(pantryCache.categoryTree.keys());
  for (let i = 0; i < categories.length; i++) {
    for (let j = i + 1; j < categories.length; j++) {
      // Example relationship: items from the same food group
      const cat1 = pantryCache.categoryTree.get(categories[i]);
      const cat2 = pantryCache.categoryTree.get(categories[j]);
      
      // Create ingredient relationships in the graph
      cat1.ingredients.forEach(ing1 => {
        cat2.ingredients.forEach(ing2 => {
          if (ing1.name.toLowerCase().includes(ing2.name.toLowerCase()) || 
              ing2.name.toLowerCase().includes(ing1.name.toLowerCase())) {
            pantryCache.ingredientGraph.addEdge(ing1, ing2);
          }
        });
      });
    }
  }
};

// Transform database data to match our format
const transformDatabaseIngredient = (item) => ({
  id: item.id.toString(),
  name: item.ingredient_name || "",
  category: item.category || "",
  amount: item.QuantityUnit || "",
});

// Initialize cache with data
const initializeCache = (ingredients) => {
  pantryCache.ingredientList = new IngredientLinkedList();
  pantryCache.ingredientStack = new IngredientStack();
  pantryCache.ingredientQueue = new IngredientQueue();
  pantryCache.ingredientGraph = new IngredientGraph();
  
  ingredients.forEach(ingredient => {
    pantryCache.ingredientList.add(ingredient);
    pantryCache.ingredientStack.push(ingredient);
    pantryCache.ingredientQueue.enqueue(ingredient);
    pantryCache.ingredientGraph.addVertex(ingredient);
  });
  
  buildCategoryTree(ingredients);
  pantryCache.initialized = true;
};

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
  const transformedData = data.map(transformDatabaseIngredient);
  
  // Initialize our data structures
  initializeCache(transformedData);
  
  return transformedData;
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
  
  // Create the transformed ingredient
  const transformedIngredient = transformDatabaseIngredient(data[0]);
  
  // Update our data structures
  if (pantryCache.initialized) {
    pantryCache.ingredientList.add(transformedIngredient);
    pantryCache.ingredientStack.push(transformedIngredient);
    pantryCache.ingredientQueue.enqueue(transformedIngredient);
    pantryCache.ingredientGraph.addVertex(transformedIngredient);
    
    // Update category tree
    if (transformedIngredient.category) {
      if (!pantryCache.categoryTree.has(transformedIngredient.category)) {
        pantryCache.categoryTree.set(transformedIngredient.category, new CategoryTreeNode(transformedIngredient.category));
      }
      pantryCache.categoryTree.get(transformedIngredient.category).addIngredient(transformedIngredient);
    }
  }
  
  return transformedIngredient;
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
  
  // Rebuild cache after deletion
  // For demonstration purposes we'd rebuild all structures after fetching updated data
  // In a real app, we could optimize by removing specific items from each structure
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
  
  // Similar to remove, we'd need to rebuild or update our structures
  // For this demo, we'll assume we refetch data to maintain structure consistency
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
  
  // Clear all data structures
  pantryCache.ingredientList = new IngredientLinkedList();
  pantryCache.ingredientStack = new IngredientStack();
  pantryCache.ingredientQueue = new IngredientQueue();
  pantryCache.ingredientGraph = new IngredientGraph();
  pantryCache.categoryTree.clear();
};

// Helper functions that expose our data structures (could be used by other components)

// Get ingredients organized by category (tree structure)
export const getIngredientsByCategory = () => {
  if (!pantryCache.initialized) return [];
  return Array.from(pantryCache.categoryTree.values());
};

// Get the last added ingredient (from stack)
export const getLastAddedIngredient = () => {
  if (!pantryCache.initialized) return null;
  return pantryCache.ingredientStack.peek();
};

// Get the first added ingredient (from queue)
export const getFirstAddedIngredient = () => {
  if (!pantryCache.initialized) return null;
  return pantryCache.ingredientQueue.front();
};

// Find related ingredients based on the graph
export const findRelatedIngredients = (ingredientId) => {
  if (!pantryCache.initialized) return [];
  const ingredient = pantryCache.ingredientList.findById(ingredientId);
  if (!ingredient) return [];
  
  return pantryCache.ingredientGraph.findRelatedIngredients(ingredient, pantryCache.ingredientList.toArray());
};
