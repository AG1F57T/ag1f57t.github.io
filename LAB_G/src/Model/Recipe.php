<?php
namespace App\Model;

use App\Service\Config;

class Recipe
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $steps = null;
    private ?string $ingredients = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Recipe
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Recipe
    {
        $this->name = $name;

        return $this;
    }

    public function getSteps(): ?string
    {
        return $this->steps;
    }

    public function setSteps(?string $steps): Recipe
    {
        $this->steps = $steps;

        return $this;
    }

    public function getIngredients(): ?string
    {
        return $this->ingredients;
    }
    
    public function setIngredients(?string $ingredients): Recipe
    {
        $this->ingredients = $ingredients;
        
        return $this;
    }
    
    public static function fromArray($array): Recipe
    {
        $recipe = new self();
        $recipe->fill($array);

        return $recipe;
    }

    public function fill($array): Recipe
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['steps'])) {
            $this->setSteps($array['steps']);
        }

        if (isset($array['ingredients'])) {
            $this->setIngredients($array['ingredients']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM recipe';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $recipes = [];
        $recipesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($recipesArray as $recipeArray) {
            $recipes[] = self::fromArray($recipeArray);
        }

        return $recipes;
    }

    public static function find($id): ?Recipe
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM recipe WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $recipeArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $recipeArray) {
            return null;
        }
        $recipe = Recipe::fromArray($recipeArray);

        return $recipe;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO recipe (name, steps, ingredients) VALUES (:name, :steps, :ingredients)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'steps' => $this->getSteps(),
                'ingredients' => $this->getIngredients(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE recipe SET name = :name, steps = :steps, ingredients = :ingredients WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':steps' => $this->getSteps(),
                ':id' => $this->getId(),
                ':ingredients' => $this->getIngredients(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM recipe WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setSteps(null);
        $this->setIngredients(null);
    }
}
