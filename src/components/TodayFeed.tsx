import React, { useState, useMemo } from 'react';
import { Flame, CheckCircle2, Zap, Trophy, Filter, Sparkles } from 'lucide-react';
import { Category, Priority, Task } from '../types';
import { CircularProgress } from './CircularProgress';
import { TaskCard } from './TaskCard';
import { QuickAddTask } from './QuickAddTask';
import { sounds } from '../utils/soundEffects';

interface TodayFeedProps {
  tasks: Task[];
  streakDays: number;
  totalFocusMinutes: number;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onAddTask: (newTask: Omit<Task, 'id' | 'createdAt'>) => void;
  onOpenDetailedModal: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
}

export const TodayFeed: React.FC<TodayFeedProps> = ({
  tasks,
  streakDays,
  totalFocusMinutes,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onStartFocus,
  onAddTask,
  onOpenDetailedModal,
  onToggleSubtask,
  onAddSubtask,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'focus' | 'habits' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks based on activeFilter & selectedCategory
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Category filter
      if (selectedCategory !== 'all' && task.category !== selectedCategory) {
        return false;
      }

      // Status/Type filter
      if (activeFilter === 'completed') return task.completed;
      if (activeFilter === 'urgent') return !task.completed && task.priority === 'high';
      if (activeFilter === 'focus') return !task.completed && (task.estimatedMinutes || 0) >= 25;
      if (activeFilter === 'habits') return task.isHabit;
      return true;
    });
  }, [tasks, activeFilter, selectedCategory]);

  const categories = ['all', 'Work', 'Personal', 'Fitness', 'Mind', 'Creative', 'Daily Ritual'];

  // Calculate dynamic momentum motivational message
  const motivationText = useMemo(() => {
    if (totalTasks === 0) return 'Add your first high-momentum intention for today!';
    if (progressPercent === 100) return '🎉 Peak Momentum Reached! Outstanding execution today.';
    if (progressPercent >= 70) return '⚡ High velocity! Just a couple more to lock in a perfect day.';
    if (progressPercent >= 40) return '🔥 Strong momentum building. Keep the flow unbroken.';
    return '🌱 Fresh day, high potential. Ignite your first task.';
  }, [progressPercent, totalTasks]);

  return (
    <div className="space-y-6">
      {/* Hero Momentum Card */}
      <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#FFFFFF] border border-[#E8DFD5] p-5 sm:p-7 tactile-shadow-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Text & Dopamine Headline */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF7F2] border border-[#E8DFD5] text-[#716E69]">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>DAILY MOMENTUM ENGINE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#27272A] tracking-tight leading-tight">
              {completedTasks} of {totalTasks} Tasks Locked In
            </h1>

            <p className="text-sm font-medium text-[#716E69] max-w-md">
              {motivationText}
            </p>

            {/* Quick Stat Micro-Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {/* Daily Streak */}
              <div className="rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 p-2.5 flex flex-col items-center md:items-start">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#D97706] uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 fill-[#D97706]" /> Streak
                </div>
                <div className="text-lg font-extrabold text-[#27272A] mt-0.5 tabular-nums">
                  {streakDays} Days
                </div>
              </div>

              {/* Completed Ratio */}
              <div className="rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 p-2.5 flex flex-col items-center md:items-start">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#006c49] uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Velocity
                </div>
                <div className="text-lg font-extrabold text-[#27272A] mt-0.5 tabular-nums">
                  {progressPercent}%
                </div>
              </div>

              {/* Deep Focus Mins */}
              <div className="rounded-2xl bg-[#FF5D38]/10 border border-[#FF5D38]/20 p-2.5 flex flex-col items-center md:items-start">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#FF5D38] uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 fill-[#FF5D38]" /> Focus
                </div>
                <div className="text-lg font-extrabold text-[#27272A] mt-0.5 tabular-nums">
                  {totalFocusMinutes}m
                </div>
              </div>

              {/* Kinetic Score */}
              <div className="rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 p-2.5 flex flex-col items-center md:items-start">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5 text-[#8B5CF6]" /> Score
                </div>
                <div className="text-lg font-extrabold text-[#27272A] mt-0.5 tabular-nums">
                  {completedTasks * 100 + streakDays * 25 + totalFocusMinutes * 2} XP
                </div>
              </div>
            </div>
          </div>

          {/* Right Circular Progress Ring */}
          <div className="shrink-0 flex flex-col items-center">
            <CircularProgress
              progress={progressPercent}
              size={144}
              strokeWidth={10}
              color={progressPercent >= 100 ? '#10B981' : '#FF5D38'}
              valueText={`${progressPercent}%`}
              subLabel={progressPercent >= 100 ? 'PEAK' : 'COMPLETED'}
            />
          </div>
        </div>
      </div>

      {/* Quick Add Bar */}
      <QuickAddTask
        onAddTask={onAddTask}
        onOpenDetailedModal={onOpenDetailedModal}
      />

      {/* Filter Tabs / Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Status Filter Pills */}
        <div className="flex items-center overflow-x-auto pb-1 sm:pb-0 gap-1.5 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveFilter('all');
            }}
            className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#27272A] text-white shadow-sm'
                : 'bg-[#FFFFFF] text-[#716E69] border border-[#E8DFD5] hover:bg-[#F4EFEA]'
            }`}
          >
            All Tasks ({tasks.length})
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveFilter('urgent');
            }}
            className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'urgent'
                ? 'bg-[#FF5D38] text-white shadow-sm'
                : 'bg-[#FFFFFF] text-[#716E69] border border-[#E8DFD5] hover:bg-[#F4EFEA]'
            }`}
          >
            🔥 Urgent ({tasks.filter((t) => !t.completed && t.priority === 'high').length})
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveFilter('focus');
            }}
            className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'focus'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'bg-[#FFFFFF] text-[#716E69] border border-[#E8DFD5] hover:bg-[#F4EFEA]'
            }`}
          >
            ⚡ Deep Focus ({tasks.filter((t) => !t.completed && (t.estimatedMinutes || 0) >= 25).length})
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveFilter('habits');
            }}
            className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'habits'
                ? 'bg-[#F59E0B] text-white shadow-sm'
                : 'bg-[#FFFFFF] text-[#716E69] border border-[#E8DFD5] hover:bg-[#F4EFEA]'
            }`}
          >
            🌱 Habits ({tasks.filter((t) => t.isHabit).length})
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveFilter('completed');
            }}
            className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'completed'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'bg-[#FFFFFF] text-[#716E69] border border-[#E8DFD5] hover:bg-[#F4EFEA]'
            }`}
          >
            ✓ Done ({completedTasks})
          </button>
        </div>

        {/* Category Pill Dropdown / Selector */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-[11px] font-bold text-[#716E69] uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3 h-3" /> Area:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              sounds.playClick();
              setSelectedCategory(e.target.value);
            }}
            className="h-8 px-3 rounded-full bg-[#FFFFFF] border border-[#E8DFD5] text-xs font-bold text-[#27272A] outline-none cursor-pointer focus:ring-1 focus:ring-[#8B5CF6]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Areas' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-[24px] bg-[#FFFFFF] border border-dashed border-[#E8DFD5] p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8DFD5] flex items-center justify-center mx-auto text-[#FF5D38]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#27272A]">No tasks in this view</h3>
            <p className="text-xs text-[#716E69] max-w-xs mx-auto">
              Everything in this filter is caught up! Add a new task above or switch your filter.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              onStartFocus={onStartFocus}
              onToggleSubtask={onToggleSubtask}
              onAddSubtask={onAddSubtask}
            />
          ))
        )}
      </div>
    </div>
  );
};
