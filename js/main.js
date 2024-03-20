document.addEventListener('DOMContentLoaded', () => {
    const model = new RecipeModel();
    const view = new RecipeView();
    const controller = new RecipeController(model, view);
});