<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$tab = $_GET['tab'] ?? '';
$base = realpath(__DIR__ . '/../../data');
$dir = $base !== false ? realpath($base . '/' . $tab) : false;

if (!$tab || $dir === false || strpos($dir, $base) !== 0 || !is_dir($dir)) {
  http_response_code(400);
  echo json_encode(['ok'=>false,'error'=>'invalid_tab','hint'=>'tabs: courantes, categories, docs'], JSON_UNESCAPED_UNICODE);
  exit;
}

function prettify_name(string $file): string {
  $n = preg_replace('/\.json$/i','',$file);
  $n = str_replace(['-','_'], ' ', $n);
  $n = preg_replace('/\s+/',' ', $n);
  return ucfirst($n);
}

function load_json_summary(string $path): array {
  $raw = @file_get_contents($path);
  if ($raw === false) return [null, 0];
  $data = json_decode($raw, true);
  if ($data === null) return [null, 0];
  if (is_array($data) && array_values($data) === $data) {
    return [null, count($data)]; // array shape
  }
  if (is_array($data) && isset($data['items']) && is_array($data['items'])) {
    $title = isset($data['title']) && is_string($data['title']) ? $data['title'] : null;
    return [$title, count($data['items'])];
  }
  return [null, 0];
}

if (isset($_GET['list'])) {
  $all = [];
  foreach (scandir($dir) as $f) {
    if ($f === '.' || $f === '..') continue;
    if (!preg_match('/\.json$/i', $f)) continue;
    $p = $dir . '/' . $f;
    if (!is_file($p) || !is_readable($p)) continue;
    [$title, $count] = load_json_summary($p);
    $all[] = ['file'=>$f, 'title'=>$title ?? prettify_name($f), 'count'=>$count];
  }
  usort($all, fn($a,$b)=> strcasecmp($a['title'],$b['title']));
  echo json_encode(['ok'=>true,'count'=>count($all),'modules'=>$all], JSON_UNESCAPED_UNICODE);
  exit;
}

$file = $_GET['file'] ?? '';
if (!$file || !preg_match('/^[a-zA-Z0-9._-]+\.json$/', $file)) {
  http_response_code(400);
  echo json_encode(['ok'=>false,'error'=>'invalid_file'], JSON_UNESCAPED_UNICODE);
  exit;
}
$path = realpath($dir . '/' . $file);
if ($path === false || strpos($path, $dir) !== 0 || !is_readable($path)) {
  http_response_code(404);
  echo json_encode(['ok'=>false,'error'=>'not_found','file'=>$file], JSON_UNESCAPED_UNICODE);
  exit;
}
$raw = file_get_contents($path);
if ($raw === false) {
  http_response_code(500);
  echo json_encode(['ok'=>false,'error'=>'read_error','file'=>$file], JSON_UNESCAPED_UNICODE);
  exit;
}
$data = json_decode($raw, true);
if ($data === null) {
  http_response_code(500);
  echo json_encode(['ok'=>false,'error'=>'json_decode_failed','file'=>$file], JSON_UNESCAPED_UNICODE);
  exit;
}
if (is_array($data) && isset($data['items']) && is_array($data['items'])) {
  echo json_encode($data['items'], JSON_UNESCAPED_UNICODE);
  exit;
}
echo $raw;
