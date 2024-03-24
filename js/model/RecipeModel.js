
class RecipeModel {
  constructor() {
    this.recipes = [];
    this.favorites = this.getFavoritesFromSession();
    this.savedRecipes = this.getSavedRecipesFromSession();
  }

  async fetchRecipes(query) {
    const APP_ID = "a6a4feb5";
    const APP_KEY = "5ab928bb533355a4a7bea5225ec1a715";
    const url = `https://api.edamam.com/search?q=${encodeURIComponent(query)}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.recipes = data.hits;
      return this.recipes;
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }

 async fetchYouTubeVideo(query) {
    const API_KEY = "AIzaSyAFN7YchzHu3TrAGBm6pTConI9BlhNTkZA";
    const youtubeSearchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}+recipe&maxResults=1&key=${API_KEY}&relevanceLanguage=fr`;
    try {
      const response = await fetch(youtubeSearchURL);
      const data = await response.json();
      if (data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        return `https://www.youtube.com/embed/${videoId}`;
      } else {
        return "";
      }
    } catch (error) {
      console.error("Error fetching YouTube video:", error);
    }
  }

  toggleFavoriteInSession(query) {
    const index = this.favorites.indexOf(query);
    if (index === -1) {
      this.favorites.push(query);
    } else {
      this.favorites.splice(index, 1);
    }
    sessionStorage.setItem("favorites", JSON.stringify(this.favorites));
  }

  getFavoritesFromSession() {
    const favorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
    return favorites;
  }

  toggleRecipeInSession(recipe) {
    const index = this.savedRecipes.findIndex(savedRecipe => savedRecipe.uri === recipe.uri);
    if (index === -1) {
      this.savedRecipes.push(recipe);
    } else {
      this.savedRecipes.splice(index, 1);
    }
    sessionStorage.setItem("savedRecipes", JSON.stringify(this.savedRecipes));
  }

  getSavedRecipesFromSession() {
    const savedRecipes = JSON.parse(sessionStorage.getItem("savedRecipes")) || [];
    return savedRecipes;
  }

  isRecipeSaved(uri) {
    return this.savedRecipes.some(recipe => recipe.uri === uri);
  }

  updateRecipe(recipe) {
    // This method would allow for the modification of recipe details.
    // For example, it could update the recipe's name, ingredients, or instructions
    // based on some criteria or user input.
    const index = this.recipes.findIndex(r => r.uri === recipe.uri);
    if (index !== -1) {
      // Update the recipe at found index with the new details from 'recipe'
      this.recipes[index] = {...this.recipes[index], ...recipe};
      // Optionally, you could re-save the updated recipes list to session or local storage
      sessionStorage.setItem("recipes", JSON.stringify(this.recipes));
    } else {
      console.log("Recipe not found for update.");
    }
  }
  
  checkForDuplicateRecipes(recipe) {
    // This method checks if the recipe already exists in the current recipes list
    // to prevent duplicate entries. It could compare based on a unique identifier,
    // like a recipe URI or name.
    const isDuplicate = this.recipes.some(r => r.uri === recipe.uri);
    if (isDuplicate) {
      console.log("This recipe is already in the list.");
      return true; // Indicate that it's a duplicate
    } else {
      return false; // Indicate that it's not a duplicate and can be added
    }
  }
  
  isFavorite(query) {
    // Assuming your favorites are stored as an array of queries
    return this.favorites.includes(query);
  }

}
