import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { User, Course } from '@/types';
import loadUserProfile from '@/actions/loadUserProfile';
import loadCourses from '@/actions/loadCourses';
import loadUserCourses from '@/actions/loadUserCourses';

// State interface
interface AppDataState {
  user: User | null;
  courses: Course[];
  userCourses: Course[];
  loading: {
    user: boolean;
    courses: boolean;
    userCourses: boolean;
  };
  error: {
    user: string | null;
    courses: string | null;
    userCourses: string | null;
  };
  lastUpdated: {
    user: number | null;
    courses: number | null;
    userCourses: number | null;
  };
}

// Action types
type AppDataAction =
  | { type: 'SET_LOADING'; payload: { key: keyof AppDataState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof AppDataState['error']; value: string | null } }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'SET_USER_COURSES'; payload: Course[] }
  | { type: 'UPDATE_USER_XP'; payload: { xpGained: number } }
  | { type: 'UPDATE_COURSE_PROGRESS'; payload: { courseId: string; completedLessons: number } }
  | { type: 'CLEAR_ALL_DATA' };

// Initial state
const initialState: AppDataState = {
  user: null,
  courses: [],
  userCourses: [],
  loading: {
    user: false,
    courses: false,
    userCourses: false,
  },
  error: {
    user: null,
    courses: null,
    userCourses: null,
  },
  lastUpdated: {
    user: null,
    courses: null,
    userCourses: null,
  },
};

// Reducer
function appDataReducer(state: AppDataState, action: AppDataAction): AppDataState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        lastUpdated: {
          ...state.lastUpdated,
          user: Date.now(),
        },
        error: {
          ...state.error,
          user: null,
        },
      };

    case 'SET_COURSES':
      return {
        ...state,
        courses: action.payload,
        lastUpdated: {
          ...state.lastUpdated,
          courses: Date.now(),
        },
        error: {
          ...state.error,
          courses: null,
        },
      };

    case 'SET_USER_COURSES':
      return {
        ...state,
        userCourses: action.payload,
        lastUpdated: {
          ...state.lastUpdated,
          userCourses: Date.now(),
        },
        error: {
          ...state.error,
          userCourses: null,
        },
      };

    case 'UPDATE_USER_XP':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          totalXp: state.user.totalXp + action.payload.xpGained,
          currentLevel: Math.floor((state.user.totalXp + action.payload.xpGained) / 1000) + 1,
        },
      };

    case 'UPDATE_COURSE_PROGRESS':
      return {
        ...state,
        userCourses: state.userCourses.map(course =>
          course.id === action.payload.courseId
            ? {
                ...course,
                completedLessons: action.payload.completedLessons,
                progressPercentage: Math.round((action.payload.completedLessons / (course.totalLessons || 1)) * 100),
              }
            : course
        ),
      };

    case 'CLEAR_ALL_DATA':
      return initialState;

    default:
      return state;
  }
}

// Context interface
interface AppDataContextValue {
  state: AppDataState;
  actions: {
    loadUser: (userId: string, forceRefresh?: boolean) => Promise<void>;
    loadCourses: (forceRefresh?: boolean) => Promise<void>;
    loadUserCourses: (userId: string, forceRefresh?: boolean) => Promise<void>;
    updateUserXP: (xpGained: number) => void;
    updateCourseProgress: (courseId: string, completedLessons: number) => void;
    clearAllData: () => void;
    refreshAll: (userId: string) => Promise<void>;
  };
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

interface AppDataProviderProps {
  children: ReactNode;
}

export function AppDataProvider({ children }: AppDataProviderProps) {
  const [state, dispatch] = useReducer(appDataReducer, initialState);

  // Helper function to check if data needs refresh
  const needsRefresh = (lastUpdated: number | null): boolean => {
    if (!lastUpdated) return true;
    return Date.now() - lastUpdated > CACHE_DURATION;
  };

  // Load user data
  const loadUser = async (userId: string, forceRefresh = false) => {
    if (!forceRefresh && !needsRefresh(state.lastUpdated.user) && state.user?.id === userId) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: { key: 'user', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'user', value: null } });

    try {
      const user = await loadUserProfile(userId);
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user profile';
      dispatch({ type: 'SET_ERROR', payload: { key: 'user', value: errorMessage } });
      console.error('Error loading user:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'user', value: false } });
    }
  };

  // Load all courses
  const loadAllCourses = async (forceRefresh = false) => {
    if (!forceRefresh && !needsRefresh(state.lastUpdated.courses)) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: { key: 'courses', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'courses', value: null } });

    try {
      const courses = await loadCourses();
      dispatch({ type: 'SET_COURSES', payload: courses });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load courses';
      dispatch({ type: 'SET_ERROR', payload: { key: 'courses', value: errorMessage } });
      console.error('Error loading courses:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'courses', value: false } });
    }
  };

  // Load user's enrolled courses
  const loadUserEnrolledCourses = async (userId: string, forceRefresh = false) => {
    if (!forceRefresh && !needsRefresh(state.lastUpdated.userCourses)) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: { key: 'userCourses', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'userCourses', value: null } });

    try {
      const userCourses = await loadUserCourses(userId);
      dispatch({ type: 'SET_USER_COURSES', payload: userCourses });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user courses';
      dispatch({ type: 'SET_ERROR', payload: { key: 'userCourses', value: errorMessage } });
      console.error('Error loading user courses:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'userCourses', value: false } });
    }
  };

  // Update user XP (optimistic update)
  const updateUserXP = (xpGained: number) => {
    dispatch({ type: 'UPDATE_USER_XP', payload: { xpGained } });
  };

  // Update course progress (optimistic update)
  const updateCourseProgress = (courseId: string, completedLessons: number) => {
    dispatch({ type: 'UPDATE_COURSE_PROGRESS', payload: { courseId, completedLessons } });
  };

  // Clear all data
  const clearAllData = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
  };

  // Refresh all data
  const refreshAll = async (userId: string) => {
    await Promise.all([
      loadUser(userId, true),
      loadAllCourses(true),
      loadUserEnrolledCourses(userId, true),
    ]);
  };

  const contextValue: AppDataContextValue = {
    state,
    actions: {
      loadUser,
      loadCourses: loadAllCourses,
      loadUserCourses: loadUserEnrolledCourses,
      updateUserXP,
      updateCourseProgress,
      clearAllData,
      refreshAll,
    },
  };

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}

// Custom hooks for specific data
export function useUser() {
  const { state, actions } = useAppData();
  return {
    user: state.user,
    loading: state.loading.user,
    error: state.error.user,
    loadUser: actions.loadUser,
    updateUserXP: actions.updateUserXP,
  };
}

export function useCourses() {
  const { state, actions } = useAppData();
  return {
    courses: state.courses,
    loading: state.loading.courses,
    error: state.error.courses,
    loadCourses: actions.loadCourses,
  };
}

export function useUserCourses() {
  const { state, actions } = useAppData();
  return {
    userCourses: state.userCourses,
    loading: state.loading.userCourses,
    error: state.error.userCourses,
    loadUserCourses: actions.loadUserCourses,
    updateCourseProgress: actions.updateCourseProgress,
  };
}