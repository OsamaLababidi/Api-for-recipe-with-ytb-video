class RecipeView {
  constructor(model) {
    this.model = model;
    this.inputRecherche = document.getElementById("input-recherche");
    this.blocResultats = document.getElementById("bloc-resultats");
    this.listeFavoris = document.getElementById("liste-favoris");
    this.infoVide = document.querySelector(".info-vide");
    this.initRecipePanel();
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
    recipes.forEach((recipe) => {
      const paragraphe = document.createElement("p");
      paragraphe.textContent = recipe.recipe.label;
      this.blocResultats.appendChild(paragraphe);
      paragraphe.addEventListener("click", () =>
        this.showRecipePopup(recipe.recipe)
      );
    });
  }

  // Point d'entrée principal pour afficher le popup de recette
  showRecipePopup(recipe) {
    const popup = this.createPopup(recipe);
    this.setupSaveRecipeListener(popup, recipe);
    this.setupClosePopupListener(popup);
    this.loadYouTubeVideo(popup, recipe);
    document.body.appendChild(popup);
  }

  createPopup(recipe) {
    const isSaved = this.model.isRecipeSaved(recipe.uri);
    const popup = document.createElement("div");
    popup.id = "recipe-popup";
    popup.innerHTML = `
        <div class="popup-content" style="position: relative;">
        <div style="position: absolute; top: 10px; left: 10px;">
          <label class="bookmark" style="cursor: pointer;">
            <input type="checkbox" ${isSaved ? "checked" : ""} style="display: none;">
            <svg width="15" viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg" class="svgIcon bookmark-icon" style="fill: ${isSaved ? 'white' : 'none'}; stroke: white; stroke-width: 7;">
              <path d="M46 62.0085L46 3.88139L3.99609 3.88139L3.99609 62.0085L24.5 45.5L46 62.0085Z"></path>
            </svg>
          </label>
        </div>
        <button id="close-popup" class="close-popup-btn" style="position: absolute; top: 10px; right: 10px;">X</button>
        <div class="popup-header" style="padding-top: 50px;">
          <img src="${recipe.image}" alt="${recipe.label}" class="popup-img">
          <div id="youtube-video-container" class="popup-video"></div>
        </div>
        <h2 class="title-recette">${recipe.label}</h2>
        <ul class="popup-ingredients">${recipe.ingredientLines.join('</li><li>')}</ul>
        ${recipe.url ? `
        <div class="plusButton" onclick="window.open('${recipe.url}', '_blank')">
          <svg class="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
          </svg>
        </div>
        ` : ''}
      </div>
    `;
    return popup;
  }
  
  

  setupSaveRecipeListener(popup, recipe) {
    const checkbox = popup.querySelector("input[type=checkbox]");
    const bookmarkIcon = popup.querySelector('.bookmark-icon');
    checkbox.addEventListener("change", () => {
      this.model.toggleRecipeInSession(recipe);
      // Change the fill of the SVG based on the checkbox's new state
      bookmarkIcon.style.fill = checkbox.checked ? 'white' : 'none';
    });
  }

  // Configure l'écouteur pour fermer le popup
  setupClosePopupListener(popup) {
    const closeButton = popup.querySelector("#close-popup");
    closeButton.addEventListener("click", () => {
      popup.remove();
    });
  }

  // Dans RecipeView
  loadYouTubeVideo(popup, recipe) {
    this.model
      .fetchYouTubeVideo(recipe.label)
      .then((videoUrl) => {
        if (videoUrl) {
          const videoContainer = popup.querySelector(
            "#youtube-video-container"
          );
          videoContainer.innerHTML = `<iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
        }
      })
      .catch((error) => console.error("Error loading YouTube video:", error));
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
    starImg.src = isFavorite
      ? "images/etoile-pleine.svg"
      : "images/etoile-vide.svg";
  }

  // Ajoutez cette méthode pour actualiser l'état de l'étoile lors du clic sur un favori
  updateFavoriteStatus() {
    const query = this.getInputValue();
    const isFavorite = this.model.isFavorite(query);
    this.toggleFavoriteStar(isFavorite);
    const favBtn = document.getElementById("btn-favoris");
    favBtn.disabled = query.length < 3; // Désactive le bouton si moins de 3 caractères
  }

  renderFavorites() {
    const favorites = this.model.getFavoritesFromSession();

    this.listeFavoris.innerHTML = ""; // Nettoie la liste des favoris existants

    favorites.forEach((fav) => {
      const li = document.createElement("li");
      li.textContent = fav;
      this.listeFavoris.appendChild(li);
      li.addEventListener("click", () => {
        this.inputRecherche.value = fav;
        this.controller.onSearch(); // Déclenchez une nouvelle recherche
        this.updateFavoriteStatus(); // Mettre à jour l'état de l'étoile
      });
    });
    const currentQuery = this.getInputValue();
    this.toggleFavoriteStar(favorites.includes(currentQuery));
  }

  toggleRecipePanel() {
    this.recipePanel.style.display =
      this.recipePanel.style.display === "none" ? "block" : "none";
    this.updateRecipePanel(); // Assurez-vous que le panneau est mis à jour à chaque fois qu'il est affiché
  }

  updateRecipePanel() {
    this.recipePanel.innerHTML = ""; // Nettoyer le contenu existant
    const savedRecipes = this.model.getSavedRecipesFromSession();
    savedRecipes.forEach((recipe) => {
      const recipeItem = document.createElement("p");
      recipeItem.textContent = recipe.label;
      this.recipePanel.appendChild(recipeItem);

      // Ajouter un écouteur pour chaque élément de recette
      recipeItem.addEventListener("click", () => {
        this.showRecipePopup(recipe);
      });
    });
  }

  // Initialisation du panneau de recettes
  initRecipePanel() {
    this.recipePanel = document.createElement("div");
    this.recipePanel.id = "recipe-panel"; // Ajouter un ID pour le style CSS si nécessaire
    this.recipePanel.style.position = "fixed";
    this.recipePanel.style.left = "0";
    this.recipePanel.style.top = "0";
    this.recipePanel.style.width = "300px";
    this.recipePanel.style.height = "100vh";
    this.recipePanel.style.backgroundColor = "#fff";
    this.recipePanel.style.zIndex = "1000";
    this.recipePanel.style.overflowY = "scroll"; // Permettre le défilement
    this.recipePanel.style.display = "none"; // Masqué par défaut
    document.body.appendChild(this.recipePanel);
  }

  setController(controller) {
    this.controller = controller;
  }
}
