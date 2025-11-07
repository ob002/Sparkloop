// Simple AI-like icebreaker generator
const iceBreakers = [
  "What's the best adventure you've been on?",
  "If you could have dinner with anyone, who would it be?",
  "What's something you're passionate about?",
  "What's your go-to karaoke song?",
  "Beach vacation or mountain retreat?",
  "What's the last book that made you think?",
  "Coffee or tea? And how do you take it?",
  "What's your hidden talent?",
  "If you could live anywhere, where would it be?",
  "What's your favorite way to spend a weekend?",
  "What's something on your bucket list?",
  "Early bird or night owl?",
  "What's the best meal you've ever had?",
  "What's your favorite childhood memory?",
  "If you could master any skill instantly, what would it be?",
  "What's your guilty pleasure TV show?",
  "Dogs or cats? (Or neither?)",
  "What's the most spontaneous thing you've done?",
  "What's your favorite season and why?",
  "What's something that always makes you smile?"
];

export const generateIceBreaker = () => {
  const randomIndex = Math.floor(Math.random() * icebreakers.length);
  return icebreakers[randomIndex];
};

// Generate icebreaker based on shared interests
export const generatePersonalizedIcebreaker = (userInterests, matchInterests) => {
  const sharedInterests = userInterests.filter(interest => 
    matchInterests.includes(interest)
  );

  if (sharedInterests.length > 0) {
    const interest = sharedInterests[0];
    const interestBreakers = {
      'Music': "What's on your playlist right now?",
      'Travel': `What's your favorite place you've traveled to?`,
      'Food': "What's the best dish you can cook?",
      'Sports': `Which sport do you enjoy most?`,
      'Art': "What kind of art inspires you?",
      'Reading': "What book are you reading right now?",
      'Movies': "What's your all-time favorite movie?",
      'Gaming': "What game are you currently playing?",
      'Fitness': "What's your favorite workout?",
      'Photography': "What do you love photographing most?",
      'Technology': "What's the coolest tech you own?",
      'Nature': "What's your favorite outdoor activity?"
    };

    return interestBreakers[interest] || generateIceBreaker();
  }

  return generateIceBreaker();
};