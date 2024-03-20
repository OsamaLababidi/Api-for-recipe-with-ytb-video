document.addEventListener('DOMContentLoaded', () => {
    const model = new RecipeModel();
    const view = new RecipeView(model); // Passez le modèle ici
    const controller = new RecipeController(model, view);
    view.setController(controller); // Passez l'instance du contrôleur à la vue
  });
  