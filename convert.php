<?php

if (count($argv) !== 2) {
    exit('Mauvais nombre d\'argument'.PHP_EOL);
}

if (file_exists($argv[1]) === false) {
    exit('Mauvais fichier'.PHP_EOL);
}

$file = file_get_contents($argv[1]);
$json = json_decode($file);

if ($json === false) {
    exit('Mauvais json'.PHP_EOL);
}

function read_groups($groups)
{
    // 1 to 11
    $index = 1;
    foreach ($groups as $group) {
        echo $index.'. '.$group->title.PHP_EOL;
        yield $group->group->answers;
        echo PHP_EOL;
        $index++;
    }
}

function read_questions($questions)
{
    // a to z
    $index = 'a';
    foreach ($questions as $question) {
        echo "\t".$index.'. '.$question->title.' ';
        yield $question;

        $index++;
    }
}

foreach (read_groups($json->answers) as $questions) {
    foreach (read_questions($questions) as $answers) {
        $type = $answers->type;
        if ($type === 'multiple_choice') {
            $vals = implode('|', $answers->$type->choices);
            echo $vals.PHP_EOL;
        } else {
            echo $answers->$type->value.PHP_EOL;
        }
    }
}
