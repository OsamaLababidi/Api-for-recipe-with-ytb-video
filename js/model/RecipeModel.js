// Model.js
class RecipeModel {
  constructor() {
    this.recipes = [];
  }

  fetchRecipes(query, callback) {
    const APP_ID = "a6a4feb5";
    const APP_KEY = "5ab928bb533355a4a7bea5225ec1a715";
    const url = `https://api.edamam.com/search?q=${encodeURIComponent(
      query
    )}&app_id=${APP_ID}&app_key=${APP_KEY}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.recipes = data.hits;
        callback(this.recipes);
      })
      .catch((error) => {
        console.error("Erreur lors de la recherche de recettes:", error);
      });
  }
  addFavoriteToSession(query) {
    let favorites = this.getFavoritesFromSession();
    if (!favorites.includes(query)) {
      favorites.push(query);
      sessionStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }

  getFavoritesFromSession() {
    const favorites = sessionStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : []; // Assurez-vous de retourner un tableau vide si 'favorites' est null
  }
  
  isFavorite(query) {
    const favorites = this.getFavoritesFromSession();
    return favorites.includes(query);
  }
}
