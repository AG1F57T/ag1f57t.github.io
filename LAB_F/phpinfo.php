<?php

spl_autoload_register(function (string $klasa): void {
    $prefix = 'App\\';
    $katalogBazowy = __DIR__ . '/lib/';

    if (strpos($klasa, $prefix) === 0) {
        $wzgledna = substr($klasa, strlen($prefix));
        $plik = $katalogBazowy . str_replace('\\', '/', $wzgledna) . '.php';
        if (file_exists($plik)) {
            require $plik;
        }
    }
});

use App\CsvEncoder;
use App\JsonEncoder;
use App\YamlEncoder;

$formaty = ['csv', 'ssv', 'tsv', 'json', 'yaml'];

$daneWejsciowe = '';
$formatWejsciowy = 'tsv';
$formatWyjsciowy = 'json';
$wynik = '';
$bladKonwersji = '';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $daneWejsciowe = $_COOKIE['dane_wejsciowe'] ?? '';
    $formatWejsciowy = $_COOKIE['format_wejsciowy'] ?? 'tsv';
    $formatWyjsciowy = $_COOKIE['format_wyjsciowy'] ?? 'json';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $daneWejsciowe = $_POST['dane_wejsciowe'] ?? '';
    $formatWejsciowy = $_POST['format_wejsciowy'] ?? 'tsv';
    $formatWyjsciowy = $_POST['format_wyjsciowy'] ?? 'json';

    setcookie('dane_wejsciowe', $daneWejsciowe, time() + 7 * 86400, '/');
    setcookie('format_wejsciowy', $formatWejsciowy, time() + 7 * 86400, '/');
    setcookie('format_wyjsciowy', $formatWyjsciowy, time() + 7 * 86400, '/');

    $enkodery = [
        new CsvEncoder($formatWejsciowy),
        new JsonEncoder(),
        new YamlEncoder(),
    ];

    $dekoder = null;
    foreach ($enkodery as $enkoder) {
        if ($enkoder->supports($formatWejsciowy)) {
            $dekoder = $enkoder;
            break;
        }
    }

    $enkoderyWyjsciowe = [
        new CsvEncoder($formatWyjsciowy),
        new JsonEncoder(),
        new YamlEncoder(),
    ];

    $enkoderWyjsciowy = null;
    foreach ($enkoderyWyjsciowe as $enkoder) {
        if ($enkoder->supports($formatWyjsciowy)) {
            $enkoderWyjsciowy = $enkoder;
            break;
        }
    }

    if ($dekoder && $enkoderWyjsciowy && trim($daneWejsciowe) !== '') {
        try {
            $dane = $dekoder->decode($daneWejsciowe);
            $wynik = $enkoderWyjsciowy->encode($dane);
        } catch (\Throwable $e) {
            $bladKonwersji = 'Błąd konwersji: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konwerter danych</title>
    <style>
        body { font-family: monospace; max-width: 900px; margin: 2em auto; padding: 0 1em; }
        label { display: block; margin-top: 1em; font-weight: bold; }
        textarea, select { width: 100%; box-sizing: border-box; }
        .blad { color: red; }
    </style>
</head>
<body>
<h1>Konwerter CSV / SSV / TSV / JSON / YAML</h1>

<form method="POST">
    <label>Dane wejściowe:</label>
    <textarea name="dane_wejsciowe"><?= htmlspecialchars($daneWejsciowe) ?></textarea>

    <label>Format wejściowy:</label>
    <select name="format_wejsciowy">
        <?php foreach ($formaty as $f): ?>
            <option value="<?= $f ?>" <?= $f === $formatWejsciowy ? 'selected' : '' ?>>
                <?= strtoupper($f) ?>
            </option>
        <?php endforeach; ?>
    </select>

    <label>Format wyjściowy:</label>
    <select name="format_wyjsciowy">
        <?php foreach ($formaty as $f): ?>
            <option value="<?= $f ?>" <?= $f === $formatWyjsciowy ? 'selected' : '' ?>>
                <?= strtoupper($f) ?>
            </option>
        <?php endforeach; ?>
    </select>

    <button type="submit">Konwertuj</button>
</form>

<?php if ($bladKonwersji): ?>
    <p class="blad"><?= htmlspecialchars($bladKonwersji) ?></p>
<?php endif; ?>

<label>Wynik:</label>
<pre><?= htmlspecialchars($wynik) ?></pre>

</body>
</html>
