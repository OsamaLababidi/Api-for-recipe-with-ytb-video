class RecipeController {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.setupEventListeners();
      this.rechercheDynamiqueActive = true; // Par défaut, la recherche dynamique est activée
      this.view.renderFavorites(this.model.getFavoritesFromSession());
    }
    
    setupEventListeners() {
      const searchBtn = document.getElementById('btn-lancer-recherche');
      // Le bouton de recherche peut rester pour une recherche explicite si nécessaire,
      // mais n'est pas utilisé pour la recherche dynamique
      searchBtn.addEventListener('click', () => this.onSearch());

      const favBtn = document.getElementById('btn-favoris');
      favBtn.addEventListener('click', () => this.addFavorite());

      const toggleRechercheDynamique = document.getElementById('toggle-recherche-dynamique');
      toggleRechercheDynamique.addEventListener('change', () => {
        this.rechercheDynamiqueActive = toggleRechercheDynamique.checked;
      });

      const inputSearch = document.getElementById('input-recherche');
      inputSearch.addEventListener('input', () => {
        const query = this.view.getInputValue();
        this.toggleFavoriteButtonState(query);
        this.view.toggleFavoriteStar(this.model.isFavorite(query));
         if (this.rechercheDynamiqueActive && inputSearch.value.length >= 3) {
        this.onSearch();
        } else {
          this.view.clearResults(); // Efface les résultats si la requête est trop courte
        }
      });
    }
  
    onSearch() {
      const query = this.view.getInputValue();
      if (query.length >= 3) { // S'assure que la requête est suffisamment longue
        this.model.fetchRecipes(query, recipes => {
          this.view.renderResults(recipes);
        });
      }
    }
  
    addFavorite() {
      const query = this.view.getInputValue();
      if (query.length >= 3 && !this.model.isFavorite(query)) {
        this.model.addFavoriteToSession(query);
        this.view.renderFavorites(this.model.getFavoritesFromSession());
      }
    }
  
    toggleFavoriteButtonState(query) {
      const favBtn = document.getElementById('btn-favoris');
      favBtn.disabled = query.length < 3;
    }
}
