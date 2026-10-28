import React, { useState } from 'react';
import { Plus, Flame, Clock, Tag } from 'lucide-react';
import { Category, Priority, Task } from '../types';
import { sounds } from '../utils/soundEffects';

interface QuickAddTaskProps {
  onAddTask: (newTask: Omit<Task, 'id' | 'createdAt'>) => void;
  onOpenDetailedModal: () => void;
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = ({
  onAddTask,
  onOpenDetailedModal,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(25);
  const [isHabit, setIsHabit] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const categories: Category[] = ['Work', 'Personal', 'Fitness', 'Mind', 'Creative', 'Daily Ritual'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playTaskPop();
    onAddTask({
      title: title.trim(),
      category,
      priority,
      completed: false,
      isHabit,
      streakDays: isHabit ? 1 : undefined,
      estimatedMinutes,
      subtasks: [],
    });

    setTitle('');
    setShowOptions(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          {/* 52px touch field, rounded-2xl, #F4EFEA -> #FFFFFF on focus with 2px #FF5D38 outline */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setShowOptions(true)}
            placeholder="Add a new momentum task or habit... (e.g. 30m Deep Code Sprint)"
            className="w-full h-[52px] rounded-2xl bg-[#F4EFEA] px-4 pl-12 pr-28 text-[15px] font-medium text-[#27272A] placeholder:text-[#8F8B84] transition-all duration-200 outline-none focus:bg-white focus:ring-2 focus:ring-[#FF5D38] focus:tactile-shadow-1"
          />

          {/* Left Icon */}
          <div className="absolute left-4 pointer-events-none text-[#FF5D38]">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>

          {/* Right Action Buttons */}
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={!title.trim()}
              className="tactile-btn flex items-center justify-center h-9 px-4 rounded-full bg-[#FF5D38] text-white text-xs font-bold tracking-wide shadow-sm hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Quick Options Popout Drawer when focused or typing */}
        {showOptions && (
          <div className="mt-2.5 p-3 rounded-2xl bg-white border border-[#E8DFD5] tactile-shadow-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#716E69] uppercase tracking-wider flex items-center gap-1 mr-1">
                  <Tag className="w-3 h-3" /> Area:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCategory(cat);
                    }}
                    className={`h-7 px-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      category === cat
                        ? 'bg-[#8B5CF6] text-white'
                        : 'bg-[#F4EFEA] text-[#716E69] hover:bg-[#E8DFD5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Priority & Minutes Quick Toggles */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setPriority(priority === 'high' ? 'medium' : priority === 'medium' ? 'low' : 'high');
                  }}
                  className={`h-7 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    priority === 'high'
                      ? 'bg-[#FF5D38] text-white'
                      : priority === 'medium'
                      ? 'bg-[#F59E0B] text-white'
                      : 'bg-[#10B981] text-white'
                  }`}
                >
                  {priority === 'high' ? '🔥 High' : priority === 'medium' ? '⚡ Med' : '🌱 Low'}
                </button>

                {/* Duration */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    const durations = [15, 25, 45, 60];
                    const nextIdx = (durations.indexOf(estimatedMinutes) + 1) % durations.length;
                    setEstimatedMinutes(durations[nextIdx]);
                  }}
                  className="h-7 px-2.5 rounded-full text-xs font-bold bg-[#F4EFEA] text-[#716E69] hover:text-[#27272A] flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3 h-3" />
                  <span>{estimatedMinutes}m</span>
                </button>

                {/* Habit toggle */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsHabit(!isHabit);
                  }}
                  className={`h-7 px-2.5 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    isHabit ? 'bg-[#F59E0B]/20 text-[#D97706]' : 'bg-[#F4EFEA] text-[#716E69]'
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  <span>Habit</span>
                </button>

                {/* Full Details link */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenDetailedModal();
                  }}
                  className="text-xs font-semibold text-[#8B5CF6] hover:underline cursor-pointer ml-1"
                >
                  More...
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
