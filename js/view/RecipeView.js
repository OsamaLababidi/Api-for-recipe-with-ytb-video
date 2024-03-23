class RecipeView {
  constructor(model) {
    this.model = model;
    this.inputRecherche = document.getElementById("input-recherche");
    this.blocResultats = document.getElementById("bloc-resultats");
    this.listeFavoris = document.getElementById("liste-favoris");
    this.infoVide = document.querySelector(".info-vide");
    this.renderFavorites();
  }

  getInputValue() {
    return this.inputRecherche.value;
  }

  clearResults() {
    this.blocResultats.innerHTML = "";
  }
  

  renderResults(recipes) {
    this.clearResults();
    recipes.forEach(recipe => {
      const paragraphe = document.createElement("p");
      paragraphe.textContent = recipe.recipe.label;
      this.blocResultats.appendChild(paragraphe);
      paragraphe.addEventListener("click", () => this.showRecipePopup(recipe.recipe));
    });
  }

  showRecipePopup(recipe) {
    const popup = document.createElement("div");
    popup.id = "recipe-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-header">
          <img src="${recipe.image}" alt="${recipe.label}" class="popup-img">
          <div id="youtube-video-container" class="popup-video"></div>
        </div>
        <h2 class="title-recette">${recipe.label}</h2>
        <ul class="popup-ingredients">${recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
        ${recipe.url ? `<button class="see-more-btn"><a href="${recipe.url}" target="_blank">Voir plus</a> </button> ` : ''}
        <button id="close-popup" class="close-popup-btn">Fermer</button>
      </div>
    `;
    document.body.appendChild(popup);

    this.model.fetchYouTubeVideo(recipe.label, videoUrl => {
      if (videoUrl) {
        const videoContainer = document.getElementById('youtube-video-container');
        videoContainer.innerHTML = `<iframe src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
    });

    document.getElementById("close-popup").addEventListener("click", () => {
      document.body.removeChild(popup);
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
    const starImg = document.getElementById("btn-favoris").querySelector("img");
    if (isFavorite) {
      starImg.src = "images/etoile-pleine.svg"; // Chemin de votre étoile jaune
    } else {
      starImg.src = "images/etoile-vide.svg";
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
