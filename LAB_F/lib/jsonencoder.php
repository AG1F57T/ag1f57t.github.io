<?php

namespace App;

class JsonEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return strtolower($format) === 'json';
    }

    public function decode(string $wejscie): array
    {
        $zdekodowane = json_decode(trim($wejscie), true);

        if (!is_array($zdekodowane)) {
            return [];
        }

        return $zdekodowane;
    }

    public function encode(array $dane): string
    {
        return json_encode($dane, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
