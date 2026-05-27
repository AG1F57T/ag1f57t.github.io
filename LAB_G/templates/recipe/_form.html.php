<?php
    /** @var $recipe ?\App\Model\Recipe */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="recipe[name]" value="<?= $recipe ? $recipe->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="steps">Steps</label>
    <textarea id="steps" name="recipe[steps]"><?= $recipe? $recipe->getSteps() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="ingredients">Ingredients</label>
    <textarea id="ingredients" name="recipe[ingredients]"><?= $recipe? $recipe->getIngredients() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
