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

function print_csv_header($csv, $json)
{
    $line = [];
    $alpha = 'a';
    $index = 1;

    // headers
    foreach (read_groups($json->answers) as $questions) {
        foreach (read_questions($questions) as $answer) {
            $line[] = "$index$alpha: $answer->title";
            $alpha++; // a, b, c,... aa, ab,...
        }

        $alpha = 'a';
        $index++; // 1, 2, 3...
    }

    fputcsv($csv, $line, ';', '"');
}

function print_to_csv($csv, $all)
{
    print_csv_header($csv, $all[0]);

    // answers
    foreach ($all as $json) {
        $line = [];
        foreach (read_groups($json->answers) as $questions) {
            foreach (read_questions($questions) as $answer) {
                $type = $answer->type;

                if ($type === 'multiple_choice') {
                    $vals = implode('|', $answer->$type->choices);
                    $line[] = $vals;
                } elseif ($type === 'file_upload') {
                    $line[] = 'file';
                } else {
                    $line[] = $answer->$type->value;
                }
            }
        }
        fputcsv($csv, $line, ';', '"');
    }
}

$csv = fopen('/tmp/a.csv', 'w+');
print_to_csv($csv, $json);
fclose($csv);