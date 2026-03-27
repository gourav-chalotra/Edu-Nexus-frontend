export const curriculumData = {
    physics: {
        id: 'physics',
        title: 'Physics',
        description: 'Explore the fundamental laws of the universe.',
        icon: '⚛️',
        chapters: [
            {
                id: 'kinematics',
                title: 'Chapter 1: Kinematics',
                description: 'Motion in a straight line, vectors, and projectile motion.',
                progress: 80,
                topics: ['Velocity & Speed', 'Acceleration', 'Projectile Motion'],
                teacherNote: "Focus on the equations of motion. They are crucial for solving projectile motion problems later on!",
                content: {
                    type: 'text', // text, video, pdf
                    body: `
            ## Introduction to Kinematics
            Kinematics is the branch of mechanics that describes the motion of points, bodies (objects), and systems of bodies (groups of objects) without considering the forces that cause them to move.
            
            ### Key Concepts
            - **Displacement**: The change in position of an object. It is a vector quantity.
            - **Velocity**: The rate of change of displacement.
            - **Acceleration**: The rate of change of velocity.
            
            ### Equations of Motion
            For constant acceleration $a$:
            1. $v = u + at$
            2. $s = ut + \\frac{1}{2}at^2$
            3. $v^2 = u^2 + 2as$
          `,
                    videoUrl: ''
                }
            },
            {
                id: 'dynamics',
                title: 'Chapter 2: Laws of Motion',
                description: 'Newton\'s laws, friction, and circular motion.',
                progress: 30,
                topics: ['Newton\'s 1st Law', 'Force & Mass', 'Friction'],
                content: {
                    type: 'text',
                    body: 'Content for Laws of Motion...'
                }
            },
            {
                id: 'thermodynamics',
                title: 'Chapter 3: Thermodynamics',
                description: 'Heat, work, temperature, and the laws of thermodynamics.',
                progress: 0,
                topics: ['Heat Transfer', 'First Law', 'Entropy'],
                content: {
                    type: 'text',
                    body: 'Content for Thermodynamics...'
                }
            }
        ]
    },
    mathematics: {
        id: 'mathematics',
        title: 'Mathematics',
        description: 'The language of numbers, structure, space, and change.',
        icon: '📐',
        chapters: [
            {
                id: 'sets',
                title: 'Chapter 1: Sets & Functions',
                description: 'Introduction to set theory and relations.',
                progress: 100,
                topics: ['Set Notation', 'Venn Diagrams', 'Functions'],
                content: { type: 'text', body: '...' }
            },
            {
                id: 'trigonometry',
                title: 'Chapter 2: Trigonometry',
                description: 'Sine, cosine, tangent and their applications.',
                progress: 45,
                topics: ['Identities', 'Equations', 'Graphs'],
                content: { type: 'text', body: '...' }
            }
        ]
    },
    chemistry: {
        id: 'chemistry',
        title: 'Chemistry',
        description: 'The study of matter and its interactions.',
        icon: '🧪',
        chapters: [
            {
                id: 'structure',
                title: 'Chapter 1: Atomic Structure',
                description: 'Electrons, protons, neutrons and orbitals.',
                progress: 10,
                topics: ['Bohr Model', 'Quantum Numbers'],
                content: { type: 'text', body: '...' }
            }
        ]
    },
    biology: {
        id: 'biology',
        title: 'Biology',
        description: 'The study of life and living organisms.',
        icon: '🧬',
        chapters: [
            {
                id: 'cell',
                title: 'Chapter 1: The Cell',
                description: 'Structure and function of cells.',
                progress: 0,
                topics: ['Cell Theory', 'Organelles', 'Mitosis'],
                content: { type: 'text', body: '...' }
            }
        ]
    },
    computer: {
        id: 'computer',
        title: 'Computer Science',
        description: 'Computation, information, and automation.',
        icon: '💻',
        chapters: [
            {
                id: 'programming',
                title: 'Chapter 1: Programming Basics',
                description: 'Introduction to coding and algorithms.',
                progress: 0,
                topics: ['Variables', 'Loops', 'Functions'],
                content: { type: 'text', body: '...' }
            }
        ]
    },
    english: {
        id: 'english',
        title: 'English',
        description: 'Literature, grammar, and communication skills.',
        icon: '📚',
        chapters: [
            {
                id: 'grammar',
                title: 'Chapter 1: Grammar',
                description: 'Rules of language and sentence structure.',
                progress: 0,
                topics: ['Nouns', 'Verbs', 'Tenses'],
                content: { type: 'text', body: '...' }
            }
        ]
    }
};
