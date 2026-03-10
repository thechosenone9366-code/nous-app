# Nous ♡ — App Couple (Expo)

Application mobile pour les couples : chat, jeux, agenda partagé et album photos.

## Stack
- **Expo SDK 50** (iOS & Android)
- **TypeScript** strict
- **React Navigation v6**
- **AsyncStorage** (persistance locale)
- **EAS Build** pour générer l'APK

---

## Fonctionnalités
- 🏡 Accueil : compteur de jours, humeur, question du jour, prochains événements
- 💬 Chat : messagerie persistante + emoji picker
- 🎲 Jeux : Quiz Couple, Vérité ou Défi, Tu Préfères...
- 📅 Agenda : calendrier + ajout d'événements
- 📸 Photos : album partagé avec légendes

---

## Installation rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer avec Expo Go (télécharger Expo Go sur ton téléphone)
npx expo start
# Scanner le QR code avec Expo Go sur Android/iOS
```

---

## Générer l'APK (Android)

```bash
# 1. Installer EAS CLI
npm install -g eas-cli

# 2. Se connecter à Expo
eas login

# 3. Générer l'APK
eas build --platform android --profile preview
```

L'APK sera disponible en téléchargement sur expo.dev après ~5 minutes.

---

## Structure

```
nous-app/
├── App.tsx                    ← Entrée principale
├── app.json                   ← Config Expo
├── eas.json                   ← Config EAS Build
└── src/
    ├── screens/               ← 9 écrans complets
    ├── components/UI.tsx      ← Composants réutilisables
    ├── navigation/            ← Stack + Tab navigation
    ├── store/AppContext.tsx   ← État global persistant
    ├── assets/data/content.ts ← Questions, quiz, défis
    └── utils/                 ← theme, types, storage
```
