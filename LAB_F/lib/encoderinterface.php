<?php

namespace App;

interface EncoderInterface
{
    public function supports(string $format): bool;
    public function decode(string $wejscie): array;
    public function encode(array $dane): string;
}
