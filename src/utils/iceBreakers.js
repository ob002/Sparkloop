export const iceBreakers = {
  general: [
    "What's the most spontaneous thing you've ever done?",
    "If you could have dinner with anyone, dead or alive, who would it be?",
    "What's your go-to karaoke song?",
    "Coffee or tea? (This says a lot about a person 😄)",
    "What's the best piece of advice you've ever received?",
    "If you could live anywhere in the world, where would it be?",
    "What's your favorite way to spend a weekend?",
    "Are you more of a morning person or night owl?",
    "What's the last show you binged?",
    "Do you have any hidden talents?",
  ],
  
  travel: [
    "What's the most beautiful place you've ever visited?",
    "Beach vacation or mountain retreat?",
    "What's at the top of your travel bucket list?",
    "Do you prefer traveling solo or with friends?",
    "What's the best food you've discovered while traveling?",
  ],
  
  foodie: [
    "What's your signature dish to cook?",
    "Sweet or savory breakfast?",
    "What's your guilty pleasure food?",
    "Do you like trying new cuisines or sticking to favorites?",
    "Coffee shop regular or home brew enthusiast?",
  ],
  
  fitness: [
    "What's your favorite way to stay active?",
    "Morning workout or evening gym session?",
    "Do you prefer solo workouts or group classes?",
    "What's your current fitness goal?",
    "Yoga, running, or lifting?",
  ],
  
  creative: [
    "What inspires your creativity?",
    "Do you prefer consuming art or creating it?",
    "What's the last concert or show you attended?",
    "Do you play any instruments?",
    "What's your favorite creative outlet?",
  ],
  
  tech: [
    "iOS or Android?",
    "What's your favorite app right now?",
    "Are you more into gaming or coding?",
    "What tech innovation are you most excited about?",
    "Favorite podcast or YouTube channel?",
  ],
};

/**
 * Generate personalized ice breakers based on user interests
 */
export const generateIceBreakers = (interests = []) => {
  const selectedBreakers = [];
  
  // Add general ice breakers
  const generalCount = 3;
  const shuffledGeneral = [...iceBreakers.general].sort(() => Math.random() - 0.5);
  selectedBreakers.push(...shuffledGeneral.slice(0, generalCount));
  
  // Add interest-specific ice breakers
  interests.forEach(interest => {
    const interestKey = interest.toLowerCase();
    if (iceBreakers[interestKey]) {
      const shuffled = [...iceBreakers[interestKey]].sort(() => Math.random() - 0.5);
      selectedBreakers.push(...shuffled.slice(0, 2));
    }
  });
  
  // Shuffle final list and return top 5
  return selectedBreakers.sort(() => Math.random() - 0.5).slice(0, 5);
};

/**
 * Get a random ice breaker question
 */
export const getRandomIceBreaker = () => {
  const allBreakers = Object.values(iceBreakers).flat();
  return allBreakers[Math.floor(Math.random() * allBreakers.length)];
};

/**
 * Interest options for onboarding
 */
export const interestOptions = [
  { value: 'travel', label: '✈️ Travel', emoji: '✈️' },
  { value: 'foodie', label: '🍕 Foodie', emoji: '🍕' },
  { value: 'fitness', label: '💪 Fitness', emoji: '💪' },
  { value: 'creative', label: '🎨 Creative', emoji: '🎨' },
  { value: 'tech', label: '💻 Tech', emoji: '💻' },
  { value: 'music', label: '🎵 Music', emoji: '🎵' },
  { value: 'reading', label: '📚 Reading', emoji: '📚' },
  { value: 'outdoors', label: '🏕️ Outdoors', emoji: '🏕️' },
  { value: 'gaming', label: '🎮 Gaming', emoji: '🎮' },
  { value: 'movies', label: '🎬 Movies', emoji: '🎬' },
];