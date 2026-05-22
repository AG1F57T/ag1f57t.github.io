<?php // I:\ptw\lab-f\yaml.php

$data = [
    'name' => 'Wojciech Kucharczyk',
    'index' => '57780',
    'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;
