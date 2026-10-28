import confetti from 'canvas-confetti';
import { Achievement, HabitRecord, Task } from '../types';

export const triggerConfetti = (originX = 0.5, originY = 0.7) => {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { x: originX, y: originY },
    colors: ['#FF5D38', '#10B981', '#8B5CF6', '#F59E0B', '#FAF7F2'],
    disableForReducedMotion: true,
  });
};

export const triggerGrandCelebration = () => {
  const end = Date.now() + 1000;
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FF5D38', '#10B981', '#F59E0B'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FF5D38', '#8B5CF6', '#F59E0B'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Ship Kinetic Momentum Design System audit',
    description: 'Verify 4-column mobile layout, tactile elevation, and circular progress ring',
    category: 'Work',
    priority: 'high',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    dueDate: 'Today, 2:00 PM',
    streakDays: 4,
    estimatedMinutes: 45,
    actualMinutes: 42,
    subtasks: [
      { id: 'sub-1', title: 'Audit color tokens against spec', completed: true },
      { id: 'sub-2', title: 'Test 24px Task Popper bounce', completed: true },
      { id: 'sub-3', title: 'Verify Plus Jakarta Sans weights', completed: true },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-2',
    title: '45-minute Zone 2 Cardio & Mobility',
    description: 'Keep heart rate in 130-142 bpm range, finish with hip mobility',
    category: 'Fitness',
    priority: 'high',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    dueDate: 'Today, 8:00 AM',
    streakDays: 14,
    isHabit: true,
    estimatedMinutes: 45,
    actualMinutes: 48,
    subtasks: [
      { id: 'sub-4', title: '35m steady pace run', completed: true },
      { id: 'sub-5', title: '10m hip & hamstring flow', completed: true },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Refactor Focus Pomodoro Sprint state machine',
    description: 'Implement interval sound synthesizer with warm chime feedback',
    category: 'Work',
    priority: 'high',
    completed: false,
    dueDate: 'Today, 5:00 PM',
    streakDays: 3,
    estimatedMinutes: 50,
    subtasks: [
      { id: 'sub-6', title: 'Add tabular number timer display', completed: true },
      { id: 'sub-7', title: 'Hook ambient focus sounds', completed: false },
      { id: 'sub-8', title: 'Link active task tracker', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Review user feedback on tactile haptic toggles',
    description: 'Synthesize community suggestions into actionable sprint backlog',
    category: 'Creative',
    priority: 'medium',
    completed: false,
    dueDate: 'Today, 6:30 PM',
    estimatedMinutes: 25,
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: '20-min evening mindfulness & journaling',
    description: 'Clear cognitive buffer before wind-down ritual',
    category: 'Mind',
    priority: 'medium',
    completed: false,
    dueDate: 'Tonight, 9:30 PM',
    streakDays: 8,
    isHabit: true,
    estimatedMinutes: 20,
    subtasks: [
      { id: 'sub-9', title: 'Gratitude 3-point entry', completed: false },
      { id: 'sub-10', title: 'Tomorrow velocity lock-in', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    title: 'Batch prep nutrition for high-energy week',
    description: 'Roast sweet potatoes, prep grilled chicken and greens',
    category: 'Personal',
    priority: 'low',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    dueDate: 'Morning',
    streakDays: 2,
    estimatedMinutes: 35,
    actualMinutes: 30,
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-7',
    title: 'Compose 500 words for newsletter essay',
    description: 'Topic: How micro-momentum beats sheer willpower',
    category: 'Creative',
    priority: 'high',
    completed: false,
    dueDate: 'Today, 4:00 PM',
    streakDays: 12,
    isHabit: true,
    estimatedMinutes: 30,
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_HABITS: HabitRecord[] = [
  {
    id: 'habit-1',
    title: 'Morning Zone 2 Cardio',
    category: 'Fitness',
    streak: 14,
    goalDaysPerWeek: 6,
    history: generateMockHistory(14, 0.95),
  },
  {
    id: 'habit-2',
    title: 'Daily Writing & Creative Log',
    category: 'Creative',
    streak: 12,
    goalDaysPerWeek: 7,
    history: generateMockHistory(12, 0.9),
  },
  {
    id: 'habit-3',
    title: '50-Min Deep Work Block',
    category: 'Work',
    streak: 9,
    goalDaysPerWeek: 5,
    history: generateMockHistory(9, 0.85),
  },
  {
    id: 'habit-4',
    title: 'Evening Mind Clear & Journal',
    category: 'Mind',
    streak: 8,
    goalDaysPerWeek: 7,
    history: generateMockHistory(8, 0.88),
  },
  {
    id: 'habit-5',
    title: 'Hydration 3 Liters Clean Water',
    category: 'Personal',
    streak: 21,
    goalDaysPerWeek: 7,
    history: generateMockHistory(21, 0.98),
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Kinetic Starter',
    description: 'Complete your first 3 tasks with tactile checkoffs',
    icon: '⚡',
    unlocked: true,
    unlockedAt: 'Yesterday',
    category: 'completion',
    progress: 3,
    maxProgress: 3,
  },
  {
    id: 'ach-2',
    title: '14-Day Velocity Fire',
    description: 'Maintain an unbroken 14-day daily momentum streak',
    icon: '🔥',
    unlocked: true,
    unlockedAt: 'Today',
    category: 'streak',
    progress: 14,
    maxProgress: 14,
  },
  {
    id: 'ach-3',
    title: 'Deep Sprint Master',
    description: 'Log 200 minutes of deep focus timer sprints',
    icon: '🎯',
    unlocked: false,
    category: 'focus',
    progress: 145,
    maxProgress: 200,
  },
  {
    id: 'ach-4',
    title: 'Century Club',
    description: 'Achieve 100 lifetime completed task pops',
    icon: '👑',
    unlocked: false,
    category: 'mastery',
    progress: 48,
    maxProgress: 100,
  },
  {
    id: 'ach-5',
    title: 'Zen Unbroken Chain',
    description: 'Complete all 5 daily habits on a single calendar day',
    icon: '🧘',
    unlocked: true,
    unlockedAt: '3 days ago',
    category: 'streak',
    progress: 5,
    maxProgress: 5,
  },
  {
    id: 'ach-6',
    title: 'Early Bird Momentum',
    description: 'Check off a High Priority task before 9:00 AM',
    icon: '🌅',
    unlocked: true,
    unlockedAt: 'Today, 8:15 AM',
    category: 'completion',
    progress: 1,
    maxProgress: 1,
  },
];

function generateMockHistory(streakDays: number, density: number): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (i < streakDays) {
      result[key] = true;
    } else {
      result[key] = Math.random() < density;
    }
  }
  return result;
}

export const loadStoredTasks = (): Task[] => {
  try {
    const saved = localStorage.getItem('km_tasks');
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_TASKS;
};

export const saveStoredTasks = (tasks: Task[]) => {
  localStorage.setItem('km_tasks', JSON.stringify(tasks));
};

export const loadStoredHabits = (): HabitRecord[] => {
  try {
    const saved = localStorage.getItem('km_habits');
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_HABITS;
};

export const saveStoredHabits = (habits: HabitRecord[]) => {
  localStorage.setItem('km_habits', JSON.stringify(habits));
};

export const loadStoredAchievements = (): Achievement[] => {
  try {
    const saved = localStorage.getItem('km_achievements');
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_ACHIEVEMENTS;
};

export const saveStoredAchievements = (achievements: Achievement[]) => {
  localStorage.setItem('km_achievements', JSON.stringify(achievements));
};
