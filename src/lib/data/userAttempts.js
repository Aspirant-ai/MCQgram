
let userAttemptsData = [
  {
    id: "attempt-1",
    examId: "ssc-cgl",
    date: "2023-05-15",
    score: 35,
    totalMarks: 50,
    timeTaken: 45,
    answers: [
      { questionId: 1, selectedOption: "b", isCorrect: true },
      { questionId: 2, selectedOption: "b", isCorrect: true },
      { questionId: 3, selectedOption: "c", isCorrect: true },
      { questionId: 4, selectedOption: "c", isCorrect: false }, 
      { questionId: 5, selectedOption: "b", isCorrect: true },
    ]
  },
  {
    id: "attempt-2",
    examId: "ibps-po",
    date: "2023-06-20",
    score: 30,
    totalMarks: 50,
    timeTaken: 55,
    answers: [
      { questionId: 1, selectedOption: "b", isCorrect: true },
    ]
  }
];

export const getUserAttempts = () => {
  try {
    const storedAttempts = localStorage.getItem('userAttempts');
    if (storedAttempts) {
      const parsedAttempts = JSON.parse(storedAttempts);
      // Basic validation
      if (Array.isArray(parsedAttempts) && parsedAttempts.every(att => att.id && att.examId)) {
        return parsedAttempts;
      }
    }
  } catch (error) {
    console.error("Error parsing user attempts from localStorage:", error);
  }
  // If localStorage is empty, invalid, or error occurs, use initial mock data
  // and sync localStorage
  localStorage.setItem('userAttempts', JSON.stringify(userAttemptsData));
  return userAttemptsData;
};

export const saveAttempt = (attempt) => {
  const currentAttempts = getUserAttempts();
  const newAttempt = {
    ...attempt,
    id: `attempt-${Date.now()}`,
    date: new Date().toISOString().split('T')[0] 
  };
  const updatedAttempts = [...currentAttempts, newAttempt];
  localStorage.setItem('userAttempts', JSON.stringify(updatedAttempts));
  userAttemptsData = updatedAttempts; // Update in-memory store as well
  return newAttempt;
};

export const getAttemptById = (attemptId) => {
  const attempts = getUserAttempts();
  return attempts.find(attempt => attempt.id === attemptId);
};