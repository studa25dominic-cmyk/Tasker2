import React, { useState } from 'react';
import { Briefcase, Dumbbell, Palette, Brain, Home, Sun, Plus, ArrowRight } from 'lucide-react';
import { Category, Task } from '../types';
import { CircularProgress } from './CircularProgress';
import { sounds } from '../utils/soundEffects';

interface ProjectHubsProps {
  tasks: Task[];
  onSelectCategoryFilter: (category: Category) => void;
  onAddTaskToCategory: (category: Category, title: string) => void;
  onToggleComplete: (id: string) => void;
}

interface ProjectMeta {
  category: Category;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  bgLight: string;
}

export const ProjectHubs: React.FC<ProjectHubsProps> = ({
  tasks,
  onSelectCategoryFilter,
  onAddTaskToCategory,
  onToggleComplete,
}) => {
  const [quickInputs, setQuickInputs] = useState<Record<string, string>>({});

  const hubs: ProjectMeta[] = [
    {
      category: 'Work',
      title: 'Work & Deep Shipping',
      description: 'Strategic builds, product design, engineering architecture, and releases',
      icon: <Briefcase className="w-5 h-5" />,
      accentColor: '#FF5D38',
      bgLight: 'rgba(255, 93, 56, 0.1)',
    },
    {
      category: 'Fitness',
      title: 'Fitness & Physical Vitality',
      description: 'Zone 2 cardio, strength resistance, mobility flow, and recovery routines',
      icon: <Dumbbell className="w-5 h-5" />,
      accentColor: '#10B981',
      bgLight: 'rgba(16, 185, 129, 0.1)',
    },
    {
      category: 'Creative',
      title: 'Creative Studio & Craft',
      description: 'Writing, audio, visual storytelling, and exploratory experiments',
      icon: <Palette className="w-5 h-5" />,
      accentColor: '#8B5CF6',
      bgLight: 'rgba(139, 92, 246, 0.1)',
    },
    {
      category: 'Mind',
      title: 'Mind & Mental Resilience',
      description: 'Meditation, cognitive offloading, journaling, and evening wind-down',
      icon: <Brain className="w-5 h-5" />,
      accentColor: '#370086',
      bgLight: 'rgba(109, 59, 215, 0.1)',
    },
    {
      category: 'Personal',
      title: 'Personal & Life Operations',
      description: 'Nutrition prep, logistics, family commitments, and life maintenance',
      icon: <Home className="w-5 h-5" />,
      accentColor: '#F59E0B',
      bgLight: 'rgba(245, 158, 11, 0.1)',
    },
    {
      category: 'Daily Ritual',
      title: 'Daily Rituals & Habits',
      description: 'Non-negotiable anchor practices that maintain biological rhythm',
      icon: <Sun className="w-5 h-5" />,
      accentColor: '#FF5D38',
      bgLight: 'rgba(255, 93, 56, 0.1)',
    },
  ];

  const handleQuickAdd = (category: Category, e: React.FormEvent) => {
    e.preventDefault();
    const val = (quickInputs[category] || '').trim();
    if (!val) return;
    onAddTaskToCategory(category, val);
    setQuickInputs({ ...quickInputs, [category]: '' });
    sounds.playTaskPop();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#27272A] tracking-tight">
            Project & Momentum Hubs
          </h2>
          <p className="text-xs text-[#716E69]">
            Organize tasks by focus areas and balance your daily energy distribution
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hubs.map((hub) => {
          const categoryTasks = tasks.filter((t) => t.category === hub.category);
          const completedCount = categoryTasks.filter((t) => t.completed).length;
          const totalCount = categoryTasks.length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          const pendingTasks = categoryTasks.filter((t) => !t.completed).slice(0, 3);

          return (
            <div
              key={hub.category}
              className="rounded-[28px] bg-[#FFFFFF] border border-[#E8DFD5] p-5 sm:p-6 tactile-shadow-1 hover:tactile-shadow-2 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header with Icon & Circular Progress */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: hub.bgLight, color: hub.accentColor }}
                    >
                      {hub.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#27272A]">{hub.title}</h3>
                      <p className="text-[11px] text-[#716E69] leading-tight">
                        {completedCount} of {totalCount} completed
                      </p>
                    </div>
                  </div>

                  <CircularProgress
                    progress={pct}
                    size={52}
                    strokeWidth={5}
                    color={hub.accentColor}
                    valueText={`${pct}%`}
                  />
                </div>

                <p className="text-xs text-[#716E69] mt-3">{hub.description}</p>

                {/* Mini Task Preview List */}
                <div className="mt-4 space-y-2">
                  {pendingTasks.length > 0 ? (
                    pendingTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          sounds.playTaskPop();
                          onToggleComplete(task.id);
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFEA] cursor-pointer text-xs font-semibold text-[#27272A] transition-colors"
                      >
                        <div className="w-4 h-4 rounded-full border-2 border-[#D6CCC2] bg-white shrink-0" />
                        <span className="truncate flex-1">{task.title}</span>
                        {task.estimatedMinutes && (
                          <span className="text-[10px] text-[#716E69]">
                            {task.estimatedMinutes}m
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center rounded-xl bg-[#FAF7F2] text-[11px] text-[#716E69] font-medium">
                      All tasks in this hub are cleared! ✨
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Add input + Jump link */}
              <div className="mt-4 pt-3 border-t border-[#F4EFEA]">
                <form
                  onSubmit={(e) => handleQuickAdd(hub.category, e)}
                  className="flex items-center gap-2 mb-2"
                >
                  <input
                    type="text"
                    value={quickInputs[hub.category] || ''}
                    onChange={(e) =>
                      setQuickInputs({ ...quickInputs, [hub.category]: e.target.value })
                    }
                    placeholder={`Add to ${hub.category}...`}
                    className="flex-1 h-8 px-3 rounded-lg bg-[#F4EFEA] text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#FF5D38]"
                  />
                  <button
                    type="submit"
                    className="h-8 px-3 rounded-lg bg-[#27272A] text-white text-xs font-bold hover:opacity-90 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectCategoryFilter(hub.category);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5D38] hover:underline cursor-pointer"
                >
                  <span>View in Today&apos;s Feed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
