export const mockCandidates: Array<{
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  experience: string;
  location: string;
  skills: string;
  selectedPlan: string;
}> = [
  {
    id: 1,
    firstName: 'Анна',
    lastName: 'Смирнова',
    position: 'Маркетолог',
    experience: '3',
    location: 'Санкт-Петербург',
    skills: 'SMM, Digital, Аналитика',
    selectedPlan: 'pro',
  },
  {
    id: 2,
    firstName: 'Иван',
    lastName: 'Петров',
    position: 'Дизайнер',
    experience: '2',
    location: 'Москва',
    skills: 'Figma, Adobe, UI/UX',
    selectedPlan: 'basic',
  },
  {
    id: 3,
    firstName: 'Мария',
    lastName: 'Кузнецова',
    position: 'Event Manager',
    experience: '5',
    location: 'Казань',
    skills: 'Организация мероприятий, коммуникации',
    selectedPlan: 'pro',
  },
];

export const uniquePositions = Array.from(new Set(mockCandidates.map(c => c.position)));
export const uniqueLocations = Array.from(new Set(mockCandidates.map(c => c.location)));
export const minExp = Math.min(...mockCandidates.map(c => Number(c.experience)));
export const maxExp = Math.max(...mockCandidates.map(c => Number(c.experience))); 