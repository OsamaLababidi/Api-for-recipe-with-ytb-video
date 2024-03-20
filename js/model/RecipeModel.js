// Model.js
class RecipeModel {
    constructor() {
      this.recipes = [];
    }
  
    fetchRecipes(query, callback) {
      const APP_ID = 'your-app-id';
      const APP_KEY = 'your-app-key';
      const url = `https://api.edamam.com/search?q=${encodeURIComponent(query)}&app_id=${APP_ID}&app_key=${APP_KEY}`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.recipes = data.hits;
          callback(this.recipes);
        })
        .catch(error => {
          console.error('Erreur lors de la recherche de recettes:', error);
        });
    }
  }
  
  // View.js
  class RecipeView {
    constructor() {
      this.inputRecherche = document.getElementById('input-recherche');
      this.blocResultats = document.getElementById('bloc-resultats');
    }
  
    getInputValue() {
      return this.inputRecherche.value;
    }
  
    clearResults() {
      this.blocResultats.innerHTML = '';
    }
  
    renderResults(recipes) {
      this.clearResults();
      recipes.forEach(recipe => {
        const paragraphe = document.createElement('p');
        paragraphe.textContent = recipe.recipe.label;
        this.blocResultats.appendChild(paragraphe);
      });
    }
  }
  

  

  