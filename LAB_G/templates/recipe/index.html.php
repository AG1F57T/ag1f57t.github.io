<?php

/** @var \App\Model\Recipe[] $recipes */
/** @var \App\Service\Router $router */

$title = 'Recipe List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Recipes List</h1>

    <a href="<?= $router->generatePath('recipe-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($recipes as $recipe): ?>
            <li><h3><?= $recipe->getName() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('recipe-show', ['id' => $recipe->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('recipe-edit', ['id' => $recipe->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
