<?php

namespace App;

class CsvEncoder implements EncoderInterface
{
    private array $separatory = [
        'csv' => ',',
        'ssv' => ';',
        'tsv' => "\t",
    ];

    private string $format;

    public function __construct(string $format)
    {
        $this->format = strtolower($format);
    }

    public function supports(string $format): bool
    {
        return isset($this->separatory[strtolower($format)]);
    }

    public function decode(string $wejscie): array
    {
        $sep = $this->separatory[$this->format];
        $linie = explode("\n", trim($wejscie));

        $naglowki = str_getcsv(array_shift($linie), $sep, '"', '');

        $dane = [];
        foreach ($linie as $linia) {
            $linia = trim($linia);
            if ($linia === '') continue;

            $wartosci = str_getcsv($linia, $sep, '"', '');

            $wiersz = [];
            foreach ($naglowki as $i => $naglowek) {
                $wiersz[$naglowek] = $wartosci[$i] ?? '';
            }
            $dane[] = $wiersz;
        }

        return $dane;
    }

    public function encode(array $dane): string
    {
        if (empty($dane)) return '';

        $sep = $this->separatory[$this->format];
        $linie = [];

        $naglowki = array_keys($dane[0]);
        $linie[] = implode($sep, $naglowki);

        foreach ($dane as $wiersz) {
            $wartosci = [];
            foreach ($naglowki as $naglowek) {
                $wartosc = $wiersz[$naglowek] ?? '';
                if (strpos($wartosc, $sep) !== false || strpos($wartosc, "\n") !== false) {
                    $wartosc = '"' . str_replace('"', '""', $wartosc) . '"';
                }
                $wartosci[] = $wartosc;
            }
            $linie[] = implode($sep, $wartosci);
        }

        return implode("\n", $linie);
    }
}