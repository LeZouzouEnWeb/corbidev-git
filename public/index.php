<?php
?><!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Git — Aide interactive</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<header class="topbar">
  <h1>Git — Aide interactive</h1>
  <div class="top-actions">
    <!-- Le hamburger Sommaire est global, rendu dans le header et activé seulement en vues détail -->
    <button id="summaryHamburger" class="hamburger-btn" title="Sommaire (T)" aria-haspopup="true" aria-expanded="false" hidden>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="2" rx="1"></rect>
        <rect x="3" y="11" width="18" height="2" rx="1"></rect>
        <rect x="3" y="17" width="18" height="2" rx="1"></rect>
      </svg>
    </button>
  </div>
</header>

<nav class="tabs" role="tablist">
  <button class="tab active" data-tab="courantes">🏁 Courantes</button>
  <button class="tab" data-tab="categories">🗂️ Toutes par catégorie</button>
  <button class="tab" data-tab="docs">📚 Documentation</button>
</nav>

<!-- Panneau Sommaire global, placé en haut à droite -->
<div id="summaryPanel" class="summary-panel" role="dialog" aria-label="Sommaire" hidden>
  <div class="summary-head">
    <strong>Sommaire</strong>
    <button id="summaryClose" class="summary-close" title="Fermer (Esc)" aria-label="Fermer">×</button>
  </div>
  <div class="summary-body">
    <ul id="summaryList"></ul>
  </div>
</div>

<main>
  <section id="tab-courantes" class="tab-panel active">
    <div class="toolbar"><input id="search-courantes" class="search" placeholder="Rechercher…" /></div>
    <div id="courantes-container" class="grid"></div>
  </section>
  <section id="tab-categories" class="tab-panel">
    <div class="toolbar"><input id="search-categories" class="search" placeholder="Rechercher une catégorie ou commande…" /></div>
    <div id="categories-container"></div>
  </section>
  <section id="tab-docs" class="tab-panel">
    <div class="toolbar"><input id="search-docs" class="search" placeholder="Rechercher dans la documentation…" /></div>
    <div id="docs-container"></div>
  </section>
</main>

<footer class="site-footer"><span>Données JSON via api/data.php</span></footer>
<script src="assets/js/app.js" defer></script>
</body>
</html>
