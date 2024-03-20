class RecipeController {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.setupEventListeners();
      this.view.renderFavorites(this.model.getFavoritesFromSession()); // Initialiser l'affichage des favoris
    }
    
    setupEventListeners() {
      const searchBtn = document.getElementById('btn-lancer-recherche');
      searchBtn.addEventListener('click', () => this.onSearch());
  
      const favBtn = document.getElementById('btn-favoris');
      favBtn.addEventListener('click', () => this.addFavorite());
  
      const inputSearch = document.getElementById('input-recherche');
      inputSearch.addEventListener('input', () => {
        const query = this.view.getInputValue();
        this.toggleFavoriteButtonState(query);
        this.view.toggleFavoriteStar(this.model.isFavorite(query));
      });
    }
  
    onSearch() {
      const query = this.view.getInputValue();
      this.model.fetchRecipes(query, recipes => {
        this.view.renderResults(recipes);
      });
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
      favBtn.disabled = query.length < 3; // Désactiver le bouton si la requête est de moins de 3 caractères
    }
  }
  