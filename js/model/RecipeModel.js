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

  fetchYouTubeVideo(query, callback) {
    const API_KEY = 'AIzaSyAFN7YchzHu3TrAGBm6pTConI9BlhNTkZA';
    const youtubeSearchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}+recette&maxResults=1&key=${API_KEY}&relevanceLanguage=fr`;
  
    fetch(youtubeSearchURL)
      .then(response => response.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const videoId = data.items[0].id.videoId;
          callback(`https://www.youtube.com/embed/${videoId}`);
        } else {
          callback('');
        }
      })
      .catch(error => console.error('Erreur lors de la recherche YouTube:', error));
  }
  
  addFavoriteToSession(query) {
    let favorites = this.getFavoritesFromSession();
    if (!favorites.includes(query)) {
      favorites.push(query);
      sessionStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }

  removeFavoriteFromSession(query) {
    let favorites = this.getFavoritesFromSession();
    const index = favorites.indexOf(query);
    if (index !== -1) {
      favorites.splice(index, 1);
      sessionStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }
  getFavoritesFromSession() {
    const favorites = sessionStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : []; //retourne un tableau vide si 'favorites' est null
  }
  
  isFavorite(query) {
    const favorites = this.getFavoritesFromSession();
    return favorites.includes(query);
  }
}
