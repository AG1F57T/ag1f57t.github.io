<?php

/** @var \App\Model\Recipe $recipe */
/** @var \App\Service\Router $router */

$title = "{$recipe->getName()} ({$recipe->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1>
        <?= $recipe->getName() ?>
    </h1>
    <article>
        <?= $recipe->getSteps();?>
    </article>
    <article>
        <?= $recipe->getIngredients();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('recipe-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('recipe-edit', ['id'=> $recipe->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
