import { db } from '../lib/firebase';
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';

// Data persistence utilities for ThreatSim

// Global progress update callback - will be set by the ProgressContext
let globalProgressUpdateCallback: (() => void) | null = null;

export const setGlobalProgressCallback = (callback: () => void) => {
  globalProgressUpdateCallback = callback;
};

const triggerProgressUpdate = () => {
  if (globalProgressUpdateCallback) {
    globalProgressUpdateCallback();
  }
};

export interface ChallengeProgress {
  challengeId: string;
  userId: string;
  completed: boolean;
  score: number;
  timeToComplete?: number;
  completedAt?: Date;
  attempts: number;
  hints: number;
  answers: Record<string, any>;
}

export interface UserProgress {
  userId: string;
  totalChallengesCompleted: number;
  totalScore: number;
  level: number;
  achievements: string[];
  lastActive: Date;
}

// Save challenge progress
export const saveChallengeProgress = (progress: ChallengeProgress): void => {
  try {
    const key = `threatSim_challenge_${progress.challengeId}_${progress.userId}`;
    const serializedProgress = JSON.stringify({
      ...progress,
      savedAt: new Date().toISOString(),
      version: '1.0'
    });
    
    localStorage.setItem(key, serializedProgress);
    console.log(`✅ Challenge progress saved: ${progress.challengeId} for user ${progress.userId}`);
    
    // Update overall user progress
    updateUserProgress(progress.userId, progress);
    
    // Trigger UI refresh
    triggerProgressUpdate();
  } catch (error) {
    console.error('❌ Failed to save challenge progress:', error);
    throw new Error('Failed to save progress. Please try again.');
  }
};

// Get challenge progress
export const getChallengeProgress = (challengeId: string, userId: string): ChallengeProgress | null => {
  const key = `threatSim_challenge_${challengeId}_${userId}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      const progress = JSON.parse(stored);
      // Convert date strings back to Date objects
      if (progress.completedAt) {
        progress.completedAt = new Date(progress.completedAt);
      }
      return progress;
    } catch (error) {
      console.error('Error parsing challenge progress:', error);
      return null;
    }
  }
  
  return null;
};

// Get all challenge progress for a user
export const getAllChallengeProgress = (userId: string): ChallengeProgress[] => {
  const keys = Object.keys(localStorage).filter(key => 
    key.startsWith(`threatSim_challenge_`) && key.endsWith(`_${userId}`)
  );
  
  const progressList: ChallengeProgress[] = [];
  
  keys.forEach(key => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const progress = JSON.parse(stored);
        if (progress.completedAt) {
          progress.completedAt = new Date(progress.completedAt);
        }
        progressList.push(progress);
      } catch (error) {
        console.error('Error parsing challenge progress:', error);
      }
    }
  });
  
  return progressList;
};

// Update user progress
export const updateUserProgress = (userId: string, challengeProgress: ChallengeProgress): void => {
  const key = `threatSim_progress_${userId}`;
  let userProgress: UserProgress;
  
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      userProgress = JSON.parse(stored);
      if (userProgress.lastActive) {
        userProgress.lastActive = new Date(userProgress.lastActive);
      }
    } catch (error) {
      console.error('Error parsing user progress:', error);
      userProgress = createNewUserProgress(userId);
    }
  } else {
    userProgress = createNewUserProgress(userId);
  }
  
  // Update progress based on challenge completion
  if (challengeProgress.completed) {
    const existingProgress = getChallengeProgress(challengeProgress.challengeId, userId);
    
    // Only count as new completion if it wasn't completed before
    if (!existingProgress || !existingProgress.completed) {
      userProgress.totalChallengesCompleted += 1;
      userProgress.totalScore += challengeProgress.score;
      
      // Calculate level based on total score
      userProgress.level = calculateLevel(userProgress.totalScore);
      
      // Check for achievements
      checkAchievements(userProgress, challengeProgress);
    }
  }
  
  userProgress.lastActive = new Date();
  localStorage.setItem(key, JSON.stringify(userProgress));
};

// Get user progress
export const getUserProgress = (userId: string): UserProgress => {
  const key = `threatSim_progress_${userId}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      const progress = JSON.parse(stored);
      if (progress.lastActive) {
        progress.lastActive = new Date(progress.lastActive);
      }
      return progress;
    } catch (error) {
      console.error('Error parsing user progress:', error);
    }
  }
  
  return createNewUserProgress(userId);
};

// Create new user progress object
const createNewUserProgress = (userId: string): UserProgress => {
  return {
    userId,
    totalChallengesCompleted: 0,
    totalScore: 0,
    level: 1,
    achievements: [],
    lastActive: new Date()
  };
};

// Calculate user level based on total score
const calculateLevel = (totalScore: number): number => {
  // Every 1000 points = 1 level
  return Math.floor(totalScore / 1000) + 1;
};

// Check and award achievements
const checkAchievements = (userProgress: UserProgress, challengeProgress: ChallengeProgress): void => {
  const achievements = userProgress.achievements;
  
  // First challenge completed
  if (userProgress.totalChallengesCompleted === 1 && !achievements.includes('first_blood')) {
    achievements.push('first_blood');
  }
  
  // Perfect score achievement
  if (challengeProgress.score === 100 && !achievements.includes('perfectionist')) {
    achievements.push('perfectionist');
  }
  
  // Speed demon (completed in under 5 minutes)
  if (challengeProgress.timeToComplete && challengeProgress.timeToComplete < 300000 && !achievements.includes('speed_demon')) {
    achievements.push('speed_demon');
  }
  
  // Challenge master (10 challenges completed)
  if (userProgress.totalChallengesCompleted >= 10 && !achievements.includes('challenge_master')) {
    achievements.push('challenge_master');
  }
  
  // Elite hacker (25 challenges completed)
  if (userProgress.totalChallengesCompleted >= 25 && !achievements.includes('elite_hacker')) {
    achievements.push('elite_hacker');
  }
};

// Save form data temporarily (for autosave functionality)
export const saveFormData = (formId: string, userId: string, data: Record<string, any>): void => {
  const key = `threatSim_form_${formId}_${userId}`;
  localStorage.setItem(key, JSON.stringify({
    data,
    savedAt: new Date().toISOString()
  }));
};

// Get saved form data
export const getSavedFormData = (formId: string, userId: string): Record<string, any> | null => {
  const key = `threatSim_form_${formId}_${userId}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      const savedData = JSON.parse(stored);
      return savedData.data;
    } catch (error) {
      console.error('Error parsing saved form data:', error);
    }
  }
  
  return null;
};

// Clear saved form data
export const clearSavedFormData = (formId: string, userId: string): void => {
  const key = `threatSim_form_${formId}_${userId}`;
  localStorage.removeItem(key);
};

// Export all user data (for backup/transfer)
export const exportUserData = (userId: string): object => {
  const userProgress = getUserProgress(userId);
  const challengeProgress = getAllChallengeProgress(userId);
  
  return {
    userProgress,
    challengeProgress,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
};

// Import user data (for restore)
export const importUserData = (userId: string, data: any): boolean => {
  try {
    if (data.userProgress) {
      const key = `threatSim_progress_${userId}`;
      localStorage.setItem(key, JSON.stringify(data.userProgress));
    }
    
    if (data.challengeProgress && Array.isArray(data.challengeProgress)) {
      data.challengeProgress.forEach((progress: ChallengeProgress) => {
        if (progress.userId === userId) {
          saveChallengeProgress(progress);
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error importing user data:', error);
    return false;
  }
};

// Clear all user data
export const clearAllUserData = (userId: string): void => {
  const keys = Object.keys(localStorage).filter(key => 
    key.includes(`_${userId}`) && key.startsWith('threatSim_')
  );
  
  keys.forEach(key => {
    localStorage.removeItem(key);
  });
};
