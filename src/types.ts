export type Priority = 'high' | 'medium' | 'low';

export type Category = 'Work' | 'Personal' | 'Fitness' | 'Mind' | 'Creative' | 'Daily Ritual';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  completedAt?: string;
  dueDate?: string; // YYYY-MM-DD or time string
  streakDays?: number; // e.g. for habits or continuous streak
  isHabit?: boolean;
  estimatedMinutes?: number;
  actualMinutes?: number;
  subtasks: SubTask[];
  createdAt: string;
}

export interface HabitRecord {
  id: string;
  title: string;
  category: Category;
  streak: number;
  history: Record<string, boolean>; // date string "YYYY-MM-DD" => true
  goalDaysPerWeek: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'focus' | 'completion' | 'mastery';
  progress: number;
  maxProgress: number;
}

export interface DayActivity {
  date: string;
  count: number;
  focusMinutes: number;
}

export type ViewTab = 'today' | 'focus' | 'habits' | 'projects';
