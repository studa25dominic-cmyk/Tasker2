import React, { useState } from 'react';
import { Flame, Check, Plus, Trophy, Award, Calendar, Sparkles } from 'lucide-react';
import { Achievement, Category, HabitRecord } from '../types';
import { sounds } from '../utils/soundEffects';
import { triggerConfetti } from '../utils/storage';

interface StreakHabitMatrixProps {
  habits: HabitRecord[];
  achievements: Achievement[];
  streakDays: number;
  onToggleHabitDay: (habitId: string, dateKey: string) => void;
  onAddHabit: (title: string, category: Category, goalDaysPerWeek: number) => void;
}

export const StreakHabitMatrix: React.FC<StreakHabitMatrixProps> = ({
  habits,
  achievements,
  streakDays,
  onToggleHabitDay,
  onAddHabit,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Personal');
  const [goalDays, setGoalDays] = useState(7);
  const [showAddForm, setShowAddForm] = useState(false);

  const todayKey = new Date().toISOString().split('T')[0];

  // Generate last 7 days for the weekly habit row
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d,
      key: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: i === 6,
    };
  });

  // Generate last 35 days for momentum heatmap
  const heatMapDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    const key = d.toISOString().split('T')[0];
    // Calculate total completed habits for this day
    const completedCount = habits.filter((h) => h.history[key]).length;
    return {
      date: d,
      key,
      count: completedCount,
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddHabit(newTitle.trim(), newCategory, goalDays);
    setNewTitle('');
    setShowAddForm(false);
    sounds.playTaskPop();
    triggerConfetti();
  };

  const handleCheckToday = (habit: HabitRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCompleted = !!habit.history[todayKey];
    if (!isCompleted) {
      sounds.playStreakFanfare();
      triggerConfetti();
    } else {
      sounds.playClick();
    }
    onToggleHabitDay(habit.id, todayKey);
  };

  return (
    <div className="space-y-6">
      {/* Top Momentum Banner */}
      <div className="rounded-[32px] bg-gradient-to-br from-[#FFF5F0] via-[#FAF7F2] to-[#FFFBEB] border border-[#E8DFD5] p-6 sm:p-8 tactile-shadow-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#F59E0B]/15 text-[#D97706] tracking-wide amber-glow">
              <Flame className="w-4 h-4 fill-[#D97706]" />
              <span>ACTIVE MOMENTUM CHAIN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#27272A] tracking-tight">
              {streakDays} Days Unbroken
            </h2>
            <p className="text-sm font-medium text-[#716E69] max-w-md">
              Every day you check off your core intentions, your kinetic momentum compounds.
              Never break the chain twice.
            </p>
          </div>

          <div className="w-28 h-28 rounded-full bg-[#FFFFFF] border-4 border-[#F59E0B] flex flex-col items-center justify-center tactile-shadow-2 shrink-0 amber-glow">
            <Flame className="w-9 h-9 fill-[#FF5D38] text-[#F59E0B] animate-pulse" />
            <span className="text-xs font-black text-[#27272A] tracking-widest mt-1 uppercase">
              14X POWER
            </span>
          </div>
        </div>
      </div>

      {/* Daily Habits & 7-Day Tracker Matrix */}
      <div className="rounded-[28px] bg-[#FFFFFF] border border-[#E8DFD5] p-5 sm:p-6 tactile-shadow-1">
        <div className="flex items-center justify-between pb-4 border-b border-[#F4EFEA]">
          <div>
            <h3 className="text-lg font-bold text-[#27272A]">Daily Habit Rituals</h3>
            <p className="text-xs text-[#716E69]">Track and check off your recurring daily actions</p>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowAddForm(!showAddForm);
            }}
            className="tactile-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF5D38] text-white text-xs font-bold shadow-sm hover:opacity-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Habit</span>
          </button>
        </div>

        {/* New Habit Form */}
        {showAddForm && (
          <form onSubmit={handleCreateHabit} className="my-4 p-4 rounded-2xl bg-[#F4EFEA] space-y-3 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Habit title (e.g. 10m Morning Stretch)"
                className="col-span-2 h-10 px-3 rounded-xl bg-white text-xs font-semibold text-[#27272A] outline-none focus:ring-2 focus:ring-[#FF5D38]"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Category)}
                className="h-10 px-3 rounded-xl bg-white text-xs font-semibold text-[#27272A] outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              >
                {(['Work', 'Personal', 'Fitness', 'Mind', 'Creative', 'Daily Ritual'] as Category[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#716E69]">
                <span>Target:</span>
                <select
                  value={goalDays}
                  onChange={(e) => setGoalDays(Number(e.target.value))}
                  className="h-8 px-2 rounded-lg bg-white text-xs font-bold text-[#27272A] outline-none"
                >
                  <option value={7}>7 days / week</option>
                  <option value={6}>6 days / week</option>
                  <option value={5}>5 days / week</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 text-xs text-[#716E69] hover:text-[#27272A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#FF5D38] text-white text-xs font-bold"
                >
                  Save Habit
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Habit Table / Row List */}
        <div className="mt-4 divide-y divide-[#F4EFEA]">
          {/* Header row with last 7 days */}
          <div className="hidden sm:flex items-center py-2 text-[11px] font-extrabold uppercase text-[#716E69] tracking-wider">
            <div className="flex-1">Habit / Area</div>
            <div className="w-20 text-center">Streak</div>
            <div className="flex items-center gap-2 w-48 justify-end">
              {last7Days.map((d) => (
                <div
                  key={d.key}
                  className={`w-6 text-center ${d.isToday ? 'text-[#FF5D38] font-black' : ''}`}
                >
                  {d.dayName}
                </div>
              ))}
            </div>
          </div>

          {habits.map((habit) => {
            const isTodayDone = !!habit.history[todayKey];

            return (
              <div
                key={habit.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Title & Category */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Today checkoff button */}
                  <button
                    type="button"
                    onClick={(e) => handleCheckToday(habit, e)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isTodayDone
                        ? 'bg-[#10B981] text-white'
                        : 'border-2 border-[#D6CCC2] bg-white hover:border-[#10B981]'
                    }`}
                  >
                    {isTodayDone && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                  </button>

                  <div>
                    <h4
                      className={`text-sm font-semibold transition-colors ${
                        isTodayDone ? 'line-through text-[#716E69]' : 'text-[#27272A]'
                      }`}
                    >
                      {habit.title}
                    </h4>
                    <span
                      className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
                      style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        color: '#7C3AED',
                      }}
                    >
                      {habit.category}
                    </span>
                  </div>
                </div>

                {/* Streak Badge */}
                <div className="flex sm:w-20 justify-start sm:justify-center items-center gap-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F59E0B]/15 text-[#D97706]">
                    <Flame className="w-3 h-3 fill-[#D97706]" />
                    <span>{habit.streak}d</span>
                  </span>
                </div>

                {/* 7 Days Dot Grid */}
                <div className="flex items-center gap-2 justify-end w-48">
                  {last7Days.map((d) => {
                    const done = !!habit.history[d.key];
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onToggleHabitDay(habit.id, d.key);
                        }}
                        title={`${d.key}: ${done ? 'Completed' : 'Missed'}`}
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer ${
                          done
                            ? 'bg-[#10B981] text-white'
                            : 'bg-[#F4EFEA] text-[#8F8B84] hover:bg-[#E8DFD5]'
                        } ${d.isToday ? 'ring-2 ring-[#FF5D38]' : ''}`}
                      >
                        {done ? '✓' : '·'}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 35-Day Momentum Activity Heatmap */}
      <div className="rounded-[28px] bg-[#FFFFFF] border border-[#E8DFD5] p-5 sm:p-6 tactile-shadow-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#27272A]">
              35-Day Kinetic Heatmap
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#716E69]">
            <span>Less</span>
            <div className="w-3 h-3 rounded-xs bg-[#F4EFEA]" />
            <div className="w-3 h-3 rounded-xs bg-[#6cf8bb]" />
            <div className="w-3 h-3 rounded-xs bg-[#10B981]" />
            <div className="w-3 h-3 rounded-xs bg-[#006c49]" />
            <span>Peak</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {heatMapDays.map((day) => {
            let bgClass = 'bg-[#F4EFEA] text-[#716E69]';
            if (day.count >= 4) {
              bgClass = 'bg-[#006c49] text-white font-bold';
            } else if (day.count >= 2) {
              bgClass = 'bg-[#10B981] text-white font-bold';
            } else if (day.count >= 1) {
              bgClass = 'bg-[#6cf8bb] text-[#006c49] font-semibold';
            }

            return (
              <div
                key={day.key}
                title={`${day.key}: ${day.count} habits logged`}
                className={`h-11 rounded-xl flex flex-col items-center justify-center text-xs transition-transform hover:scale-105 cursor-pointer ${bgClass}`}
              >
                <span className="text-[10px] leading-none opacity-80">{day.month}</span>
                <span className="text-xs leading-tight mt-0.5">{day.dayNum}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Accolades & Badges */}
      <div className="rounded-[28px] bg-[#FFFFFF] border border-[#E8DFD5] p-5 sm:p-6 tactile-shadow-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#27272A]">
              Accolades & Achievements
            </h3>
          </div>
          <span className="text-xs font-bold text-[#8B5CF6]">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`rounded-2xl border p-4 transition-all duration-200 ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-[#FFFBEB] to-[#FFFFFF] border-[#F59E0B]/30 amber-glow'
                  : 'bg-[#F4EFEA]/50 border-[#E8DFD5] opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    ach.unlocked ? 'bg-[#F59E0B]/20 text-[#D97706]' : 'bg-[#E8DFD5] grayscale'
                  }`}
                >
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#27272A] truncate">{ach.title}</h4>
                    {ach.unlocked && <Award className="w-3.5 h-3.5 text-[#F59E0B]" />}
                  </div>
                  <p className="text-[11px] text-[#716E69] mt-0.5 line-clamp-2">
                    {ach.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[10px] font-bold text-[#716E69] mb-1">
                      <span>Progress</span>
                      <span>
                        {ach.progress} / {ach.maxProgress}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E8DFD5] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          ach.unlocked ? 'bg-[#10B981]' : 'bg-[#8B5CF6]'
                        }`}
                        style={{
                          width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
