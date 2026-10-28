import React from 'react';
import { Flame, Plus, Volume2, VolumeX, Sparkles, CheckSquare, Timer, Target, LayoutGrid } from 'lucide-react';
import { ViewTab } from '../types';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  streakDays: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNewTaskModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  streakDays,
  soundEnabled,
  onToggleSound,
  onOpenNewTaskModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD5] transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('today')}>
            {/* Logo Glyph */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF5D38] to-[#b42804] flex items-center justify-center text-white tactile-shadow-1 coral-glow">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-[#27272A]">
                  Kinetic<span className="text-[#FF5D38]">Momentum</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FF5D38]/10 text-[#FF5D38]">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#716E69] -mt-0.5">
                Tactile Rituals & Deep Velocity
              </p>
            </div>
          </div>

          {/* Mobile Right Action Bar */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Streak Badge */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F59E0B]/15 text-[#D97706] amber-glow">
              <Flame className="w-3.5 h-3.5 fill-[#D97706]" />
              <span>{streakDays}d</span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              className="p-2 rounded-full bg-[#FFFFFF] border border-[#E8DFD5] text-[#716E69]"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#10B981]" /> : <VolumeX className="w-4 h-4 text-[#ba1a1a]" />}
            </button>

            {/* Mobile New Task CTA */}
            <button
              type="button"
              onClick={onOpenNewTaskModal}
              className="w-9 h-9 rounded-full bg-[#FF5D38] text-white flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Center Navigation Tabs (Full Pill) */}
        <nav className="flex items-center overflow-x-auto p-1 rounded-full bg-[#F4EFEA] border border-[#E8DFD5] scrollbar-none self-center sm:self-auto">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onTabChange('today');
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'today'
                ? 'bg-[#FFFFFF] text-[#27272A] shadow-xs font-extrabold'
                : 'text-[#716E69] hover:text-[#27272A]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#FF5D38]" />
            <span>Today</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onTabChange('focus');
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'focus'
                ? 'bg-[#FFFFFF] text-[#27272A] shadow-xs font-extrabold'
                : 'text-[#716E69] hover:text-[#27272A]'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Focus Sprint</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onTabChange('habits');
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'habits'
                ? 'bg-[#FFFFFF] text-[#27272A] shadow-xs font-extrabold'
                : 'text-[#716E69] hover:text-[#27272A]'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Habits & Streaks</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onTabChange('projects');
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'projects'
                ? 'bg-[#FFFFFF] text-[#27272A] shadow-xs font-extrabold'
                : 'text-[#716E69] hover:text-[#27272A]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#006c49]" />
            <span>Projects</span>
          </button>
        </nav>

        {/* Right Desktop Badges & Primary CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Unbroken Streak Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-[#F59E0B]/15 text-[#D97706] amber-glow cursor-pointer" onClick={() => onTabChange('habits')}>
            <Flame className="w-4 h-4 fill-[#D97706]" />
            <span>{streakDays} Days</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound synthesis' : 'Enable tactile audio'}
            className="p-2 rounded-full bg-[#FFFFFF] border border-[#E8DFD5] text-[#716E69] hover:text-[#27272A] hover:bg-[#F4EFEA] transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#10B981]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#ba1a1a]" />
            )}
          </button>

          {/* Primary CTA Button (Tactile Coral Pill) */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenNewTaskModal();
            }}
            className="tactile-btn inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#FF5D38] text-white text-xs font-extrabold tracking-wide coral-glow hover:opacity-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
