/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Category, HabitRecord, Task, ViewTab } from './types';
import { Header } from './components/Header';
import { TodayFeed } from './components/TodayFeed';
import { FocusSprint } from './components/FocusSprint';
import { StreakHabitMatrix } from './components/StreakHabitMatrix';
import { ProjectHubs } from './components/ProjectHubs';
import { TaskModal } from './components/TaskModal';
import { sounds } from './utils/soundEffects';
import {
  loadStoredTasks,
  saveStoredTasks,
  loadStoredHabits,
  saveStoredHabits,
  loadStoredAchievements,
  saveStoredAchievements,
  triggerGrandCelebration,
} from './utils/storage';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadStoredTasks);
  const [habits, setHabits] = useState<HabitRecord[]>(loadStoredHabits);
  const [achievements, setAchievements] = useState(loadStoredAchievements);
  const [currentTab, setCurrentTab] = useState<ViewTab>('today');
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('km_total_focus_minutes');
    return saved ? Number(saved) : 145;
  });

  // Calculate streak days
  const streakDays = 14;

  // Persist tasks
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  // Persist habits
  useEffect(() => {
    saveStoredHabits(habits);
  }, [habits]);

  // Persist achievements
  useEffect(() => {
    saveStoredAchievements(achievements);
  }, [achievements]);

  // Check achievements on state change
  useEffect(() => {
    const completedCount = tasks.filter((t) => t.completed).length;
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === 'ach-1') {
          const unlocked = completedCount >= 3;
          return { ...ach, progress: Math.min(3, completedCount), unlocked };
        }
        if (ach.id === 'ach-3') {
          const unlocked = totalFocusMinutes >= 200;
          return { ...ach, progress: Math.min(200, totalFocusMinutes), unlocked };
        }
        if (ach.id === 'ach-4') {
          const unlocked = completedCount >= 100;
          return { ...ach, progress: completedCount, unlocked };
        }
        return ach;
      })
    );
  }, [tasks, totalFocusMinutes]);

  const handleToggleSound = () => {
    const nextVal = sounds.toggleSound();
    setSoundEnabled(nextVal);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });

      // Check if all tasks completed!
      const allDone = updated.every((t) => t.completed);
      if (allDone && updated.length > 0) {
        triggerGrandCelebration();
        sounds.playStreakFanfare();
      }

      return updated;
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeFocusTask?.id === id) {
      setActiveFocusTask(null);
    }
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleOpenNewModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (taskData.id) {
      // Edit
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
              }
            : t
        )
      );
    } else {
      // Create new
      const newTask: Task = {
        ...taskData,
        id: 'task-' + Date.now(),
        createdAt: new Date().toISOString(),
        subtasks: taskData.subtasks || [],
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleStartFocus = (task: Task) => {
    setActiveFocusTask(task);
    setCurrentTab('focus');
  };

  const handleLogFocusMinutes = (minutes: number) => {
    setTotalFocusMinutes((prev) => {
      const updated = prev + minutes;
      localStorage.setItem('km_total_focus_minutes', String(updated));
      return updated;
    });
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    sounds.playTaskPop();
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
          };
        }
        return task;
      })
    );
  };

  const handleAddSubtask = (taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [
              ...task.subtasks,
              {
                id: 'sub-' + Date.now(),
                title,
                completed: false,
              },
            ],
          };
        }
        return task;
      })
    );
  };

  const handleToggleHabitDay = (habitId: string, dateKey: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const nextVal = !h.history[dateKey];
          const newHistory = { ...h.history, [dateKey]: nextVal };
          const newStreak = nextVal ? h.streak + 1 : Math.max(0, h.streak - 1);
          return {
            ...h,
            streak: newStreak,
            history: newHistory,
          };
        }
        return h;
      })
    );
  };

  const handleAddHabit = (
    title: string,
    category: Category,
    goalDaysPerWeek: number
  ) => {
    const newHabit: HabitRecord = {
      id: 'habit-' + Date.now(),
      title,
      category,
      streak: 1,
      goalDaysPerWeek,
      history: {
        [new Date().toISOString().split('T')[0]]: true,
      },
    };
    setHabits((prev) => [newHabit, ...prev]);
  };

  const handleSelectCategoryFilter = (category: Category) => {
    setCurrentTab('today');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#27272A] flex flex-col selection:bg-[#FF5D38]/20 selection:text-[#FF5D38]">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        streakDays={streakDays}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenNewTaskModal={handleOpenNewModal}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'today' && (
          <TodayFeed
            tasks={tasks}
            streakDays={streakDays}
            totalFocusMinutes={totalFocusMinutes}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleOpenEdit}
            onStartFocus={handleStartFocus}
            onAddTask={(newTask) =>
              handleSaveTask({ ...newTask, subtasks: newTask.subtasks || [] })
            }
            onOpenDetailedModal={handleOpenNewModal}
            onToggleSubtask={handleToggleSubtask}
            onAddSubtask={handleAddSubtask}
          />
        )}

        {currentTab === 'focus' && (
          <FocusSprint
            tasks={tasks}
            activeTask={activeFocusTask}
            onTaskCompleted={(id) => {
              handleToggleComplete(id);
              setActiveFocusTask(null);
            }}
            onLogFocusMinutes={handleLogFocusMinutes}
          />
        )}

        {currentTab === 'habits' && (
          <StreakHabitMatrix
            habits={habits}
            achievements={achievements}
            streakDays={streakDays}
            onToggleHabitDay={handleToggleHabitDay}
            onAddHabit={handleAddHabit}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectHubs
            tasks={tasks}
            onSelectCategoryFilter={handleSelectCategoryFilter}
            onAddTaskToCategory={(category, title) =>
              handleSaveTask({
                title,
                category,
                priority: 'medium',
                completed: false,
                subtasks: [],
              })
            }
            onToggleComplete={handleToggleComplete}
          />
        )}
      </main>

      {/* Footer Branding Note */}
      <footer className="py-6 border-t border-[#E8DFD5] text-center text-xs text-[#716E69] select-none">
        <p className="font-semibold">
          Kinetic Momentum • Tactile Modernism & High-Velocity Rituals
        </p>
      </footer>

      {/* Full Task Modal Sheet */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveTask={handleSaveTask}
        initialTask={editingTask}
      />
    </div>
  );
}
