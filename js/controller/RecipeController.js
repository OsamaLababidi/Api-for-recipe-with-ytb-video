class RecipeController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.setupEventListeners();
    // Initialisez la recherche dynamique basée sur l'état initial du commutateur
    this.rechercheDynamiqueActive = document.getElementById('cbx-51').checked;
    this.view.renderFavorites(this.model.getFavoritesFromSession());
  }

  setupEventListeners() {
    const searchBtn = document.getElementById("btn-lancer-recherche");
    searchBtn.addEventListener("click", () => this.onSearch());
    const filterBtn = document.querySelector('.filter');
    filterBtn.addEventListener('click', () => this.view.toggleRecipePanel());
    const favBtn = document.getElementById("btn-favoris");
    favBtn.addEventListener("click", () => this.addFavorite());

    // Écoutez les changements sur le commutateur au lieu de la checkbox directement
    const toggleRechercheDynamique = document.getElementById("cbx-51");
    toggleRechercheDynamique.addEventListener("change", () => {
      // Mettez à jour la recherche dynamique basée sur l'état du commutateur
      this.rechercheDynamiqueActive = toggleRechercheDynamique.checked;
      // Facultatif : ajoutez toute logique supplémentaire nécessaire lors de l'activation/désactivation
    });

    const inputSearch = document.getElementById("input-recherche");
    inputSearch.addEventListener("input", () => this.handleInput());
  }

  // Factorisez la logique de manipulation des entrées pour réutilisation
  handleInput() {
    const query = this.view.getInputValue();
    this.toggleFavoriteButtonState(query);
    this.view.toggleFavoriteStar(this.model.isFavorite(query));
    if (this.rechercheDynamiqueActive && query.length >= 3) {
      this.onSearch();
    } else {
      this.view.clearResults();
    }
  }

  async onSearch() {
    const query = this.view.getInputValue();
    if (query.length >= 3) {
      try {
        const recipes = await this.model.fetchRecipes(query);
        this.view.renderResults(recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
  }
  
async addFavorite() {
    const query = this.view.getInputValue();
    if (query.length >= 3) {
        // Toggle favorite state instead of explicitly adding
        this.model.toggleFavoriteInSession(query);
        // Since the favorites list could have changed, re-render it
        this.view.renderFavorites(this.model.getFavoritesFromSession());
        // Optionally, update the star status based on the new state
        const isFavoriteNow = this.model.isFavorite(query);
        this.view.toggleFavoriteStar(isFavoriteNow);
    }
}

  

  toggleFavoriteButtonState(query) {
    const favBtn = document.getElementById("btn-favoris");
    favBtn.disabled = query.length < 3;
    // Update the star icon based on whether the current query is a favorite
    this.view.toggleFavoriteStar(this.model.isFavorite(query));
  }
}
