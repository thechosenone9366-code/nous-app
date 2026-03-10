export const DAILY_QUESTIONS = [
  'Quel est ton souvenir préféré de notre premier voyage ensemble ?',
  'Si tu pouvais revivre un moment avec moi, lequel ce serait ?',
  'Quelle est la chose que tu aimes le plus chez moi ?',
  'Où rêves-tu qu\'on voyage ensemble ?',
  'Quel film aimes-tu regarder dans nos bras ?',
  'Quelle est notre chanson préférée et pourquoi ?',
  'Qu\'est-ce qui t\'a attiré chez moi la première fois ?',
  'Quelle petite attention de ma part te touche le plus ?',
  'Comment imagines-tu notre vie dans 5 ans ?',
  'Quelle est la chose que tu veux qu\'on fasse ensemble cette année ?',
  'Quel est ton plat préféré qu\'on cuisine ensemble ?',
  'Qu\'est-ce qui te fait sourire quand tu penses à nous ?',
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  category: 'goûts' | 'habitudes' | 'rêves' | 'souvenirs';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Quelle est la couleur préférée de ton partenaire ?',
    options: ['Rouge', 'Bleu', 'Vert', 'Violet'],
    category: 'goûts',
  },
  {
    id: 2,
    question: 'Quel plat préfère manger ton partenaire ?',
    options: ['Pizza', 'Sushi', 'Pasta', 'Burger'],
    category: 'goûts',
  },
  {
    id: 3,
    question: 'Comment ton partenaire aime-t-il passer le dimanche ?',
    options: ['Cinéma', 'Randonnée', 'Repos à la maison', 'Shopping'],
    category: 'habitudes',
  },
  {
    id: 4,
    question: 'Quel est le rêve de voyage de ton partenaire ?',
    options: ['Japon', 'Islande', 'Italie', 'Mexique'],
    category: 'rêves',
  },
  {
    id: 5,
    question: 'Quelle est la saison préférée de ton partenaire ?',
    options: ['Printemps', 'Été', 'Automne', 'Hiver'],
    category: 'goûts',
  },
  {
    id: 6,
    question: 'Que fait ton partenaire quand il est stressé ?',
    options: ['Écoute de la musique', 'Cuisine', 'Se promène', 'Regarde une série'],
    category: 'habitudes',
  },
  {
    id: 7,
    question: 'Quel genre de film préfère ton partenaire ?',
    options: ['Comédie', 'Romance', 'Action', 'Documentaire'],
    category: 'goûts',
  },
  {
    id: 8,
    question: 'Quel est le sport préféré de ton partenaire ?',
    options: ['Natation', 'Yoga', 'Course à pied', 'Aucun'],
    category: 'habitudes',
  },
];

export const TRUTH_CARDS = [
  'Quelle est la première chose que tu as remarquée chez moi ?',
  'Quel est ton moment préféré que nous avons partagé ?',
  'Qu\'est-ce qui te rend le plus heureux dans notre relation ?',
  'Quelle est la chose que tu n\'as jamais osé me dire ?',
  'Quel est ton rêve secret que je ne connais pas encore ?',
  'À quel moment as-tu su que tu étais amoureux(se) de moi ?',
  'Quelle qualité chez moi t\'a séduit(e) en premier ?',
  'Qu\'est-ce que tu changerais dans notre quotidien ?',
  'Quelle est ta peur la plus secrète dans notre relation ?',
  'Qu\'est-ce que notre relation t\'a appris sur toi-même ?',
];

export const DARE_CARDS = [
  'Chante une chanson romantique à ton partenaire 🎵',
  'Fais un massage de 5 minutes à ton partenaire 💆',
  'Écris un petit poème sur votre amour en 2 minutes ✍️',
  'Imite ton partenaire pendant 30 secondes 😂',
  'Dis 5 choses que tu adores chez ton partenaire 💕',
  'Prépare une surprise pour ce soir 🎁',
  'Appelle un(e) ami(e) et dis-lui pourquoi tu aimes ton partenaire 📞',
  'Fais un câlin de 30 secondes sans parler 🤗',
  'Dessine le portrait de ton partenaire en 1 minute 🎨',
  'Danse ensemble sur la prochaine chanson qui passe 🕺',
];

export const WOULD_YOU_RATHER = [
  {
    a: 'Vivre dans une grande ville animée',
    b: 'Vivre dans une petite maison à la campagne',
  },
  {
    a: 'Voyager dans le passé',
    b: 'Voyager dans le futur',
  },
  {
    a: 'Un dîner romantique à la maison',
    b: 'Un restaurant étoilé',
  },
  {
    a: 'Avoir un chien',
    b: 'Avoir un chat',
  },
  {
    a: 'Une semaine à la plage',
    b: 'Une semaine à la montagne',
  },
  {
    a: 'Toujours savoir ce que l\'autre pense',
    b: 'Avoir une mémoire parfaite de tous vos moments',
  },
  {
    a: 'Cuisiner ensemble tous les soirs',
    b: 'Commander à l\'extérieur quand vous voulez',
  },
  {
    a: 'Un long voyage d\'aventure',
    b: 'Un city trip culturel',
  },
];

export const MOODS = [
  { emoji: '🥰', label: 'Amoureux(se)' },
  { emoji: '😊', label: 'Joyeux(se)' },
  { emoji: '😌', label: 'Calme' },
  { emoji: '🤩', label: 'Excité(e)' },
  { emoji: '😢', label: 'Triste' },
  { emoji: '😴', label: 'Fatigué(e)' },
  { emoji: '🤗', label: 'Câlin(e)' },
  { emoji: '💪', label: 'Motivé(e)' },
];

export const CHAT_EMOJIS = ['❤️','🥰','😘','💕','✨','🌸','🦋','🌙','☀️','🎶','🍓','🌹','💫','🎀','🌈','🍀'];
