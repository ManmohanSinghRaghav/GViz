export const mockCourses = [
  {
    id: 1,
    title: 'Data Visualization Fundamentals',
    description: 'Learn the basics of data visualization with interactive examples',
    duration: '6 weeks',
    level: 'Beginner',
    modules: [
      {
        id: 1,
        title: 'Introduction to Data Visualization',
        completed: true,
        lessons: [
          { id: 1, title: 'Why Data Visualization?', duration: '15min', completed: true },
          { id: 2, title: 'Basic Principles', duration: '20min', completed: true }
        ]
      },
      {
        id: 2,
        title: 'Chart Types and Usage',
        completed: false,
        lessons: [
          { id: 3, title: 'Bar Charts & Line Graphs', duration: '25min', completed: false },
          { id: 4, title: 'Scatter Plots', duration: '20min', completed: false }
        ]
      }
    ],
    progress: 35,
    enrolled: true
  },
  // Add more courses...
];

export const mockProgress = {
  completedCourses: 2,
  totalCourses: 5,
  completedLessons: 15,
  totalLessons: 45,
  averageScore: 85
};
