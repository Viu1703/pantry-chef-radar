
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
  
  // Remove an ingredient by id
  remove(id) {
    if (!this.head) return null;
    
    if (this.head.data.id.toString() === id.toString()) {
      const removedData = this.head.data;
      this.head = this.head.next;
      this.size--;
      return removedData;
    }
    
    let current = this.head;
    while (current.next && current.next.data.id.toString() !== id.toString()) {
      current = current.next;
    }
    
    if (current.next) {
      const removedData = current.next.data;
      current.next = current.next.next;
      this.size--;
      return removedData;
    }
    
    return null;
  }
  
  // Update an ingredient by id
  update(id, updatedFields) {
    let current = this.head;
    while (current) {
      if (current.data.id.toString() === id.toString()) {
        current.data = { ...current.data, ...updatedFields };
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
    ).filter(Boolean);
  }
  
  // Remove a vertex and all its edges
  removeVertex(id) {
    if (!this.adjacencyList.has(id)) return;
    
    // Remove all edges connected to this vertex
    while (this.adjacencyList.get(id).length) {
      const adjacentVertex = this.adjacencyList.get(id).pop();
      this.removeEdge(id, adjacentVertex);
    }
    
    // Remove the vertex itself
    this.adjacencyList.delete(id);
  }
  
  // Remove an edge between two vertices
  removeEdge(id1, id2) {
    if (this.adjacencyList.has(id1)) {
      this.adjacencyList.set(
        id1, 
        this.adjacencyList.get(id1).filter(id => id !== id2)
      );
    }
    if (this.adjacencyList.has(id2)) {
      this.adjacencyList.set(
        id2, 
        this.adjacencyList.get(id2).filter(id => id !== id1)
      );
    }
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
  
  remove(id) {
    const index = this.items.findIndex(item => item.id.toString() === id.toString());
    if (index !== -1) {
      return this.items.splice(index, 1)[0];
    }
    return null;
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
  
  remove(id) {
    const index = this.items.findIndex(item => item.id.toString() === id.toString());
    if (index !== -1) {
      return this.items.splice(index, 1)[0];
    }
    return null;
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

// CSV file path (would be stored in the public directory in a real app)
const CSV_FILE_NAME = 'pantry_data.csv';

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

// CSV Utility Functions
// Transform CSV row to ingredient object
const transformCSVtoIngredient = (row) => ({
  id: row.id || String(Date.now()),
  name: row.ingredient_name || "",
  category: row.category || "",
  amount: row.QuantityUnit || "",
});

// Parse CSV string to array of objects
const parseCSV = (csvString) => {
  if (!csvString.trim()) {
    return [];
  }
  
  const rows = csvString.split('\n');
  const headers = rows[0].split(',').map(h => h.trim());
  
  return rows.slice(1).filter(row => row.trim()).map(row => {
    const values = row.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
};

// Convert array of ingredients to CSV string
const ingredientsToCSV = (ingredients) => {
  if (ingredients.length === 0) {
    return 'id,ingredient_name,category,QuantityUnit,user_id';
  }
  
  const headers = ['id', 'ingredient_name', 'category', 'QuantityUnit', 'user_id'];
  const rows = ingredients.map(ing => [
    ing.id,
    ing.name,
    ing.category,
    ing.amount,
    '1' // default user_id for local storage
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
};

// Read CSV data from localStorage
const readFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(CSV_FILE_NAME);
    if (!data) {
      return 'id,ingredient_name,category,QuantityUnit,user_id';
    }
    return data;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return 'id,ingredient_name,category,QuantityUnit,user_id';
  }
};

// Write CSV data to localStorage
const writeToLocalStorage = (csvString) => {
  try {
    localStorage.setItem(CSV_FILE_NAME, csvString);
    return true;
  } catch (error) {
    console.error("Error writing to localStorage:", error);
    return false;
  }
};

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

// Fetch all pantry ingredients from the local storage
export const fetchPantryIngredients = async () => {
  try {
    const csvData = readFromLocalStorage();
    const parsedData = parseCSV(csvData);
    
    console.log("Fetched data from local storage:", parsedData);
    
    // Transform data to match our format
    const transformedData = parsedData.map(transformCSVtoIngredient);
    
    // Initialize our data structures
    initializeCache(transformedData);
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching pantry items:", error);
    throw error;
  }
};

// Generate a unique ID for new ingredients
const generateUniqueId = () => {
  return String(Date.now());
};

// Add a new ingredient to the pantry
export const addPantryIngredient = async (ingredient) => {
  try {
    // Read current data
    const csvData = readFromLocalStorage();
    const parsedData = parseCSV(csvData);
    
    // Create the transformed ingredient with a new ID
    const newId = generateUniqueId();
    const transformedIngredient = {
      id: newId,
      name: ingredient.name.trim(),
      category: ingredient.category,
      amount: ingredient.amount,
    };
    
    // Add to parsed data
    parsedData.push({
      id: transformedIngredient.id,
      ingredient_name: transformedIngredient.name,
      category: transformedIngredient.category,
      QuantityUnit: transformedIngredient.amount,
      user_id: '1'
    });
    
    // Convert back to CSV and save
    const newCSVData = ingredientsToCSV(parsedData.map(transformCSVtoIngredient));
    writeToLocalStorage(newCSVData);
    
    console.log("Added new ingredient:", transformedIngredient);
    
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
  } catch (error) {
    console.error("Error adding ingredient:", error);
    throw error;
  }
};

// Remove an ingredient from the pantry
export const removePantryIngredient = async (id) => {
  try {
    // Read current data
    const csvData = readFromLocalStorage();
    const parsedData = parseCSV(csvData);
    
    // Filter out the ingredient to remove
    const updatedData = parsedData.filter(item => item.id !== id);
    
    // Convert back to CSV and save
    const newCSVData = ingredientsToCSV(updatedData.map(transformCSVtoIngredient));
    writeToLocalStorage(newCSVData);
    
    // Update data structures
    if (pantryCache.initialized) {
      // Remove from linked list
      pantryCache.ingredientList.remove(id);
      
      // Remove from stack
      pantryCache.ingredientStack.remove(id);
      
      // Remove from queue
      pantryCache.ingredientQueue.remove(id);
      
      // Remove from graph
      pantryCache.ingredientGraph.removeVertex(id);
      
      // Need to rebuild the category tree after removing an ingredient
      buildCategoryTree(pantryCache.ingredientList.toArray());
    }
    
    return true;
  } catch (error) {
    console.error("Error removing ingredient:", error);
    throw error;
  }
};

// Update an existing ingredient
export const updatePantryIngredient = async (id, updatedFields) => {
  try {
    // Read current data
    const csvData = readFromLocalStorage();
    const parsedData = parseCSV(csvData);
    
    // Find and update the ingredient
    const updatedData = parsedData.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ingredient_name: updatedFields.name || item.ingredient_name,
          category: updatedFields.category || item.category,
          QuantityUnit: updatedFields.amount || item.QuantityUnit
        };
      }
      return item;
    });
    
    // Convert back to CSV and save
    const newCSVData = ingredientsToCSV(updatedData.map(transformCSVtoIngredient));
    writeToLocalStorage(newCSVData);
    
    // Update our data structures
    if (pantryCache.initialized) {
      const updatedIngredient = pantryCache.ingredientList.update(id, updatedFields);
      
      // Rebuild cache to ensure consistency
      initializeCache(pantryCache.ingredientList.toArray());
    }
    
    return true;
  } catch (error) {
    console.error("Error updating ingredient:", error);
    throw error;
  }
};

// Clear all ingredients from the pantry
export const clearPantryIngredients = async () => {
  try {
    // Create empty CSV with just headers
    const emptyCSV = 'id,ingredient_name,category,QuantityUnit,user_id';
    writeToLocalStorage(emptyCSV);
    
    // Clear all data structures
    pantryCache.ingredientList = new IngredientLinkedList();
    pantryCache.ingredientStack = new IngredientStack();
    pantryCache.ingredientQueue = new IngredientQueue();
    pantryCache.ingredientGraph = new IngredientGraph();
    pantryCache.categoryTree.clear();
    
    return true;
  } catch (error) {
    console.error("Error clearing pantry:", error);
    throw error;
  }
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
