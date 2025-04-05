const sdgColors = [
    '#EAB8B8', // Goal 1: No Poverty
    '#F6D6A8', // Goal 2: Zero Hunger
    '#F9E6A0', // Goal 3: Good Health and Well-being
    '#F4E1A4', // Goal 4: Quality Education
    '#A8D8B9', // Goal 5: Gender Equality
    '#A8D8E1', // Goal 6: Clean Water and Sanitation
    '#A8C8E1', // Goal 7: Affordable and Clean Energy
    '#A8B8E1', // Goal 8: Decent Work and Economic Growth
    '#A8A8E1', // Goal 9: Industry, Innovation and Infrastructure
    '#D8A8E1', // Goal 10: Reduced Inequalities
    '#E1A8D8', // Goal 11: Sustainable Cities and Communities
    '#E1A8B8', // Goal 12: Responsible Consumption and Production
    '#E1C8A8', // Goal 13: Climate Action
    '#E1D8A8', // Goal 14: Life Below Water
    '#E1E1A8', // Goal 15: Life on Land
    '#E1E1E1', // Goal 16: Peace, Justice and Strong Institutions
    '#E1E1E1'  // Goal 17: Partnerships for the Goals
];

export const getRandomColor = () => {
    return sdgColors[Math.floor(Math.random() * sdgColors.length)];
};