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
        echo $index.'. '.$group->title;

        yield $group->group->answers;

        $index++;
    }
}

function read_questions($questions)
{
    // a to z
    foreach ($questions as $question) {
        yield $question;
    }
}

function print_to_stdin($json)
{
    $alpha = 'a';

    foreach (read_groups($json->answers) as $questions) {
        foreach (read_questions($questions) as $answers) {
            echo "\t".$alpha.'. '.$answers->title.' ';
            $type = $answers->type;

            if ($type === 'multiple_choice') {
                $vals = implode('|', $answers->$type->choices);
                echo $vals.PHP_EOL;
            } else {
                echo $answers->$type->value.PHP_EOL;
            }

            $alpha++;
        }

        echo PHP_EOL;
        $alpha = 'a';
    }
}

function print_to_csv($json)
{
    $csv = fopen('/tmp/a.csv', 'w+');
    $line = [];
    $alpha = 'a';
    $index = 1;

    // headers
    foreach (read_groups($json->answers) as $questions) {
        foreach (read_questions($questions) as $answer) {
            echo "$index$alpha: $answer->title;";

            $line[] = "$index$alpha: $answer->title";

            $alpha++; // a, b, c,... aa, ab,...
        }

        $alpha = 'a';
        $index++; // 1, 2, 3...
    }

    fputcsv($csv, $line, ';', '"');
    $line = [];
    $alpha = 'a';
    $index = 1;

    // answers
    foreach (read_groups($json->answers) as $questions) {
        foreach (read_questions($questions) as $answer) {
            $type = $answer->type;

            if ($type === 'multiple_choice') {
                $vals = implode('|', $answer->$type->choices);
                echo "$vals;";
                $line[] = $vals;
            } else {
                echo $answer->$type->value.";";
                $line[] = $answer->$type->value;
            }
        }
    }
    fputcsv($csv, $line, ';', '"');
    fclose($csv);
}

print_to_csv($json);
