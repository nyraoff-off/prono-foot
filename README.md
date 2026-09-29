# Prono Foot

Site d'analyse de matchs de football et de generation de pronostics.

## Ce qui est fait dans cette premiere version

- Page d'accueil avec barre de recherche
- Recherche de matchs a venir par nom d'equipe (API-Football)
- Bouton "Analyser" qui lance le calcul
- Affichage des 3 meilleurs pronos avec pourcentage de confiance et phrase courte
- Design sombre et epure avec accent vert

## Criteres utilises dans cette version (a etendre)

- Forme recente (5 derniers matchs, victoires/nuls/defaites, buts marques/encaisses)
- Avantage du terrain (domicile)
- Confrontations directes (5 dernieres, poids limite)
- Estimation du nombre de buts (over/under 2.5)
- Estimation "les deux equipes marquent"

## Installation

1. Installer Node.js si ce n'est pas deja fait (version 18 ou plus)
2. Dans le dossier du projet, lancer : npm install
3. Creer un compte gratuit sur https://www.api-football.com/
4. Copier .env.example vers .env.local et coller ta cle API dedans
5. Lancer : npm run dev
6. Ouvrir http://localhost:3000
