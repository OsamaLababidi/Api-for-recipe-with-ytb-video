
class RecipeModel {
  constructor() {
    // Initializes the recipes array to store recipe search results.
    this.recipes = [];
    // Loads favorite recipes from session storage when the model is instantiated.
    this.favorites = this.getFavoritesFromSession();
    // Loads saved recipes from session storage, allowing for persistence across sessions.
    this.savedRecipes = this.getSavedRecipesFromSession();
    // API credentials for Edamam's recipe search API.
    this.APP_ID = "a6a4feb5";
    this.APP_KEY = "5ab928bb533355a4a7bea5225ec1a715";
    // API key for YouTube Data API v3, used to fetch recipe videos.
    this.API_KEY_YTB = "AIzaSyAvTBCZDYKDljPbdYUPPM4Uky7S95zpIFg";
  }

  // Asynchronously fetches recipes from the Edamam API based on the user's query.
  async fetchRecipes(query) {
    const url = `https://api.edamam.com/search?q=${encodeURIComponent(query)}&app_id=${this.APP_ID}&app_key=${this.APP_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.recipes = data.hits; // Stores the fetched recipes in the model.
      return this.recipes;// Returns the fetched recipes for further processing
    } catch (error) {
      console.error("Error fetching recipes:", error); // Logs errors to the console.
    }
  }

  // Asynchronously fetches a relevant YouTube video for the recipe query.
 async fetchYouTubeVideo(query) {
    const youtubeSearchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}+recipe&maxResults=1&key=${this.API_KEY_YTB}&relevanceLanguage=fr`;
    try {
      const response = await fetch(youtubeSearchURL);
      const data = await response.json();
      if (data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        return `https://www.youtube.com/embed/${videoId}`; // Returns the URL for embedding the video.
      } else {
        return ""; // Returns an empty string if no video is found.
      }
    } catch (error) {
      console.error("Error fetching YouTube video:", error);
    }
  }

  // Toggles the favorite status of a recipe query in session storage.
  toggleFavoriteInSession(query) {
    const index = this.favorites.indexOf(query);
    if (index === -1) {
      this.favorites.push(query);  // Adds the query to favorites if not already present.
    } else {
      this.favorites.splice(index, 1); // Removes the query from favorites if present.
    }
    sessionStorage.setItem("favorites", JSON.stringify(this.favorites)); // Updates session storage.
  }

  // Retrieves the list of favorite recipes from session storage.
  getFavoritesFromSession() {
    const favorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
    return favorites; // Returns an array of favorite recipes.
  }

  // Toggles the saved status of a recipe in session storage.
  toggleRecipeInSession(recipe) {
    const index = this.savedRecipes.findIndex(savedRecipe => savedRecipe.uri === recipe.uri);
    if (index === -1) {
      this.savedRecipes.push(recipe);
    } else {
      this.savedRecipes.splice(index, 1);
    }
    sessionStorage.setItem("savedRecipes", JSON.stringify(this.savedRecipes));
  }

  // Retrieves the list of saved recipes from session storage.
  getSavedRecipesFromSession() {
    const savedRecipes = JSON.parse(sessionStorage.getItem("savedRecipes")) || [];
    return savedRecipes;
  }

  // Checks if a specific recipe URI corresponds to a saved recipe.
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
