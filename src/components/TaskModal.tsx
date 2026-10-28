import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Flame, Clock, Calendar, CheckSquare } from 'lucide-react';
import { Category, Priority, SubTask, Task } from '../types';
import { sounds } from '../utils/soundEffects';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [isHabit, setIsHabit] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setCategory(initialTask.category);
      setPriority(initialTask.priority);
      setDueDate(initialTask.dueDate || '');
      setEstimatedMinutes(initialTask.estimatedMinutes || 25);
      setIsHabit(!!initialTask.isHabit);
      setStreakDays(initialTask.streakDays || 0);
      setSubtasks(initialTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Work');
      setPriority('medium');
      setDueDate('Today, 5:00 PM');
      setEstimatedMinutes(30);
      setIsHabit(false);
      setStreakDays(0);
      setSubtasks([]);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: 'sub-' + Date.now(),
        title: newSubtaskInput.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskInput('');
    sounds.playClick();
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
    sounds.playClick();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playTaskPop();
    onSaveTask({
      id: initialTask?.id,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      completed: initialTask?.completed || false,
      dueDate: dueDate.trim() || undefined,
      estimatedMinutes,
      isHabit,
      streakDays: isHabit ? (streakDays > 0 ? streakDays : 1) : undefined,
      subtasks,
    });
    onClose();
  };

  const categories: Category[] = ['Work', 'Personal', 'Fitness', 'Mind', 'Creative', 'Daily Ritual'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#27272A]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-[28px] bg-[#FFFFFF] p-6 sm:p-7 tactile-shadow-3 border border-[#E8DFD5] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F4EFEA]">
          <h2 className="text-xl font-bold text-[#27272A]">
            {initialTask ? 'Edit Momentum Task' : 'New Momentum Task'}
          </h2>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-full text-[#716E69] hover:bg-[#F4EFEA] hover:text-[#27272A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#716E69] mb-1.5">
              Task Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Sprint Review & Ship Release"
              className="w-full h-12 rounded-xl bg-[#F4EFEA] px-4 text-sm font-semibold text-[#27272A] outline-none focus:bg-white focus:ring-2 focus:ring-[#FF5D38]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#716E69] mb-1.5">
              Description / Intention
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What outcome marks this task done? Add key milestones or references..."
              className="w-full rounded-xl bg-[#F4EFEA] p-3 text-sm text-[#27272A] outline-none focus:bg-white focus:ring-2 focus:ring-[#FF5D38] resize-none"
            />
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#716E69] mb-1.5">
              Area / Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-[#8B5CF6] text-white shadow-sm'
                      : 'bg-[#F4EFEA] text-[#716E69] hover:bg-[#E8DFD5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Minutes Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#716E69] mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setPriority(p);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-[#FF5D38] text-white shadow-sm'
                          : p === 'medium'
                          ? 'bg-[#F59E0B] text-white shadow-sm'
                          : 'bg-[#10B981] text-white shadow-sm'
                        : 'bg-[#F4EFEA] text-[#716E69]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#716E69] mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Est. Minutes
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full h-10 rounded-xl bg-[#F4EFEA] px-3 text-sm font-semibold text-[#27272A] outline-none focus:bg-white focus:ring-2 focus:ring-[#FF5D38]"
              />
            </div>
          </div>

          {/* Due Time & Streak */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#716E69] mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Due / Schedule
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Today, 5:00 PM"
                className="w-full h-10 rounded-xl bg-[#F4EFEA] px-3 text-sm font-semibold text-[#27272A] outline-none focus:bg-white focus:ring-2 focus:ring-[#FF5D38]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#716E69] mb-1.5 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#F59E0B]" /> Habit & Streak
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsHabit(!isHabit)}
                  className={`flex-1 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isHabit
                      ? 'bg-[#F59E0B] text-white shadow-sm'
                      : 'bg-[#F4EFEA] text-[#716E69]'
                  }`}
                >
                  {isHabit ? '✓ Daily Habit' : 'Normal Task'}
                </button>
                {isHabit && (
                  <input
                    type="number"
                    min="0"
                    value={streakDays}
                    onChange={(e) => setStreakDays(Number(e.target.value))}
                    title="Current streak days"
                    className="w-16 h-10 rounded-xl bg-[#F4EFEA] text-center text-xs font-bold text-[#D97706] outline-none focus:bg-white focus:ring-2 focus:ring-[#F59E0B]"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#716E69] mb-1.5 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5" /> Subtasks Checklist ({subtasks.length})
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto mb-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] text-xs font-medium text-[#27272A]"
                >
                  <span>{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-[#ba1a1a] p-1 hover:opacity-75"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask step..."
                className="flex-1 h-9 rounded-lg bg-[#F4EFEA] px-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-[#8B5CF6]"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="h-9 px-3 rounded-lg bg-[#8B5CF6] text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F4EFEA]">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-[#716E69] hover:bg-[#F4EFEA] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tactile-btn px-6 py-2.5 rounded-full bg-[#FF5D38] text-white text-xs font-bold tracking-wide shadow-sm hover:opacity-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>{initialTask ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
