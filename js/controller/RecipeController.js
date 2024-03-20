  // Controller.js
  class RecipeController {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      const searchBtn = document.getElementById('btn-lancer-recherche');
      searchBtn.addEventListener('click', () => this.onSearch());
    }
  
    onSearch() {
      const query = this.view.getInputValue();
      this.model.fetchRecipes(query, recipes => {
        this.view.renderResults(recipes);
      });
    }
  }