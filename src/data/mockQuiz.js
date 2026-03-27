export const mockQuizData = {
    id: 'quiz-1',
    title: 'Kinematics Basics',
    subject: 'Physics',
    questions: [
        {
            id: 1,
            type: 'mcq',
            question: 'Which of the following is a vector quantity?',
            options: ['Speed', 'Distance', 'Displacement', 'Mass'],
            correctAnswer: 'Displacement',
            points: 100
        },
        {
            id: 2,
            type: 'mcq',
            question: 'The slope of a velocity-time graph represents:',
            options: ['Displacement', 'Acceleration', 'Speed', 'Distance'],
            correctAnswer: 'Acceleration',
            points: 100
        },
        {
            id: 3,
            type: 'fill-in',
            question: 'The rate of change of displacement is called ______.',
            correctAnswer: 'velocity',
            points: 150
        }
    ]
};
