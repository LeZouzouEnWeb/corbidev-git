<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$map = [
  'courantes' => realpath(__DIR__ . '/../../data/courantes.json'),
  'commandes_par_categorie' => realpath(__DIR__ . '/../../data/commandes_par_categorie.json'),
  'docs_par_categorie' => realpath(__DIR__ . '/../../data/docs_par_categorie.json'),
];

$key = $_GET['f'] ?? '';
if (!isset($map[$key])) {
  http_response_code(400);
  echo json_encode(['ok'=>false, 'error'=>'invalid_file', 'allow'=>array_keys($map)]);
  exit;
}
$path = $map[$key];
if ($path === false || !is_readable($path)) {
  http_response_code(404);
  echo json_encode(['ok'=>false, 'error'=>'not_found', 'file'=>$key]);
  exit;
}
$raw = file_get_contents($path);
if ($raw === false) {
  http_response_code(500);
  echo json_encode(['ok'=>false, 'error'=>'read_error', 'file'=>$key]);
  exit;
}
echo $raw;
