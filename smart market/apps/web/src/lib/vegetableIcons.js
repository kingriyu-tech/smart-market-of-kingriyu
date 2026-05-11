export const vegetableIcons = {
  'Tomato': '🍅',
  'Lettuce': '🥬',
  'Carrots': '🥕',
  'Onion': '🧅',
  'Potato': '🥔',
  'Broccoli': '🥦',
  'Cucumber': '🥒',
  'Bell Pepper': '🫑',
  'Spinach': '🥬',
  'Garlic': '🧄',
  'Cabbage': '🥬',
  'Eggplant': '🍆',
  'Pumpkin': '🎃',
  'Corn': '🌽',
  'Peas': '🫛',
  'Radish': '🌶️',
  'Zucchini': '🥒',
  'Asparagus': '🌱'
};

export const getVegetableIcon = (name) => {
  if (!name) return '🥬';
  // Try exact match first
  if (vegetableIcons[name]) return vegetableIcons[name];
  
  // Try case-insensitive partial match
  const lowerName = name.toLowerCase();
  const match = Object.keys(vegetableIcons).find(key => 
    lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)
  );
  
  return match ? vegetableIcons[match] : '🥬';
};