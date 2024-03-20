class RecipeView {
  constructor(model) {
    this.model = model; // On garde une référence au modèle
    this.inputRecherche = document.getElementById("input-recherche");
    this.blocResultats = document.getElementById("bloc-resultats");
    this.listeFavoris = document.getElementById("liste-favoris"); // Ajout de l'ID de la liste des favoris
    this.infoVide = document.querySelector(".info-vide"); // Ajout pour la gestion de l'affichage 'Aucune recherche favorite'
    this.renderFavorites(); // Maintenant, ça fonctionne car `this.model` est défini
  }

  getInputValue() {
    return this.inputRecherche.value;
  }

  clearResults() {
    this.blocResultats.innerHTML = "";
  }

  renderResults(recipes) {
    this.clearResults();
    recipes.forEach((recipe) => {
      const paragraphe = document.createElement("p");
      paragraphe.textContent = recipe.recipe.label;
      this.blocResultats.appendChild(paragraphe);
    });
  }

  addFavorite(query) {
    if (query.length < 3) {
      return;
    }
    this.model.addFavoriteToSession(query);
    this.renderFavorites();
    this.toggleFavoriteStar(true); // Mettre l'étoile en jaune
  }

  toggleFavoriteStar(isFavorite) {
    const starImg = document.getElementById('btn-favoris').querySelector('img');
    if (isFavorite) {
      starImg.src = 'images/etoile-pleine.svg'; // Chemin de votre étoile jaune
    } else {
      starImg.src = 'images/etoile-vide.svg';
    }
  }
  renderFavorites() {
    const favorites = this.model.getFavoritesFromSession();

    this.listeFavoris.innerHTML = ""; // Nettoie la liste des favoris existants

    favorites.forEach((fav) => {
      const li = document.createElement("li");
      li.textContent = fav;
      this.listeFavoris.appendChild(li);
      li.addEventListener("click", () => {
        this.inputRecherche.value = fav; // Définissez l'entrée de recherche sur le favori
        this.controller.onSearch(); // Déclenchez une nouvelle recherche
      });
      
    });
    const currentQuery = this.getInputValue();
    this.toggleFavoriteStar(favorites.includes(currentQuery));
  }

  setController(controller) {
    this.controller = controller;
  }
}
