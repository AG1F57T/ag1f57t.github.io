<?php

namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Recipe;
use App\Service\Router;
use App\Service\Templating;

class RecipeController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $recipes = Recipe::findAll();
        $html = $templating->render('recipe/index.html.php', [
            'recipes' => $recipes,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestRecipe, Templating $templating, Router $router): ?string
    {
        if ($requestRecipe) {
            $recipe = Recipe::fromArray($requestRecipe);
            // @todo missing validation
            $recipe->save();

            $path = $router->generatePath('recipe-index');
            $router->redirect($path);
            return null;
        } else {
            $recipe = new Recipe();
        }

        $html = $templating->render('recipe/create.html.php', [
            'recipe' => $recipe,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $recipeId, ?array $requestRecipe, Templating $templating, Router $router): ?string
    {
        $recipe = Recipe::find($recipeId);
        if (!$recipe) {
            throw new NotFoundException("Missing recipe with id $recipeId");
        }

        if ($requestRecipe) {
            $recipe->fill($requestRecipe);
            // @todo missing validation
            $recipe->save();

            $path = $router->generatePath('recipe-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('recipe/edit.html.php', [
            'recipe' => $recipe,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $recipeId, Templating $templating, Router $router): ?string
    {
        $recipe = Recipe::find($recipeId);
        if (!$recipe) {
            throw new NotFoundException("Missing recipe with id $recipeId");
        }

        $html = $templating->render('recipe/show.html.php', [
            'recipe' => $recipe,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $recipeId, Router $router): ?string
    {
        $recipe = Recipe::find($recipeId);
        if (!$recipe) {
            throw new NotFoundException("Missing recipe with id $recipeId");
        }

        $recipe->delete();
        $path = $router->generatePath('recipe-index');
        $router->redirect($path);
        return null;
    }
}
