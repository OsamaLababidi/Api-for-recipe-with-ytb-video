window.addEventListener('load', () => {
  const model = new RecipeModel();
  const view = new RecipeView(model); 
  const controller = new RecipeController(model, view);
  view.setController(controller); 
});
  