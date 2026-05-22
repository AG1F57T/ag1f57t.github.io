<?php

namespace App;

class YamlEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return strtolower($format) === 'yaml';
    }

    public function decode(string $wejscie): array
    {
        $zdekodowane = yaml_parse(trim($wejscie));

        if (!is_array($zdekodowane)) {
            return [];
        }

        return $zdekodowane;
    }

    public function encode(array $dane): string
    {
        return yaml_emit($dane, YAML_UTF8_ENCODING);
    }
}
