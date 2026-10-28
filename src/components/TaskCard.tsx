import React, { useState } from 'react';
import { Check, Flame, Clock, ChevronDown, ChevronUp, Play, Trash2, Edit3, Plus } from 'lucide-react';
import { Task } from '../types';
import { sounds } from '../utils/soundEffects';
import { triggerConfetti } from '../utils/storage';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onStartFocus,
  onToggleSubtask,
  onAddSubtask,
}) => {
  const [isPopping, setIsPopping] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showAddSubtaskInput, setShowAddSubtaskInput] = useState(false);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 250);

    if (!task.completed) {
      sounds.playTaskPop();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      triggerConfetti(x, y);
    } else {
      sounds.playClick();
    }

    onToggleComplete(task.id);
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  const handleCreateSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
    setShowAddSubtaskInput(false);
    sounds.playClick();
  };

  return (
    <div
      className={`group relative rounded-[20px] border border-[#E8DFD5] bg-[#FFFFFF] px-4 sm:px-5 py-3.5 transition-all duration-200 tactile-shadow-1 hover:tactile-shadow-2 ${
        task.completed ? 'opacity-85 bg-[#FAF7F2]/60' : ''
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* The Task Popper Checkbox */}
        <button
          type="button"
          onClick={handleCheckboxClick}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
          className={`relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform duration-150 active:scale-90 focus:outline-none ${
            task.completed
              ? 'bg-[#10B981] border-2 border-[#10B981] text-white shadow-sm'
              : 'border-2 border-[#D6CCC2] bg-white hover:border-[#FF5D38]'
          } ${isPopping ? 'scale-125' : 'scale-100'}`}
        >
          {task.completed && (
            <Check className="h-3.5 w-3.5 stroke-[3.5] text-white animate-in zoom-in-75 duration-150" />
          )}
        </button>

        {/* Task Details & Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {/* Category Project Chip */}
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide"
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                color: '#7C3AED',
              }}
            >
              {task.category}
            </span>

            {/* Urgent / Priority Chip */}
            {task.priority === 'high' && (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide"
                style={{
                  backgroundColor: 'rgba(255, 93, 56, 0.12)',
                  color: '#FF5D38',
                }}
              >
                Urgent
              </span>
            )}

            {/* Streak Badge */}
            {task.streakDays && task.streakDays > 0 && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide"
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#D97706',
                }}
              >
                <Flame className="w-3.5 h-3.5 fill-[#D97706]" />
                <span>{task.streakDays}d streak</span>
              </span>
            )}

            {/* Estimated Minutes */}
            {task.estimatedMinutes && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#716E69]">
                <Clock className="w-3 h-3 text-[#716E69]" />
                <span>{task.estimatedMinutes}m</span>
              </span>
            )}

            {/* Due Time */}
            {task.dueDate && (
              <span className="text-[11px] font-medium text-[#716E69] ml-auto">
                {task.dueDate}
              </span>
            )}
          </div>

          {/* Task Title with Animated Strike-through */}
          <h3
            className={`text-[15px] sm:text-[16px] font-semibold leading-snug transition-all duration-200 select-none ${
              task.completed
                ? 'line-through text-[#716E69] decoration-[#10B981] decoration-2'
                : 'text-[#27272A]'
            }`}
          >
            {task.title}
          </h3>

          {/* Description if present */}
          {task.description && (
            <p
              className={`text-xs mt-1 leading-relaxed transition-colors duration-200 ${
                task.completed ? 'text-[#A19D97] line-through' : 'text-[#716E69]'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Subtasks Progress Mini Row */}
          {totalSubtasks > 0 && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#716E69] hover:text-[#27272A] transition-colors"
              >
                {showSubtasks ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {completedSubtasks}/{totalSubtasks} subtasks
                </span>
              </button>
              <div className="w-20 h-1.5 bg-[#F4EFEA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all duration-300"
                  style={{
                    width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Expanded Subtask List */}
          {showSubtasks && (
            <div className="mt-3 pt-3 border-t border-[#F4EFEA] space-y-2">
              {task.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onToggleSubtask(task.id, sub.id)}
                  className="flex items-center gap-2.5 cursor-pointer text-xs group/sub"
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                      sub.completed
                        ? 'bg-[#10B981] text-white'
                        : 'border border-[#D6CCC2] bg-white group-hover/sub:border-[#10B981]'
                    }`}
                  >
                    {sub.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`transition-colors ${
                      sub.completed ? 'line-through text-[#8F8B84]' : 'text-[#27272A] font-medium'
                    }`}
                  >
                    {sub.title}
                  </span>
                </div>
              ))}

              {showAddSubtaskInput ? (
                <form onSubmit={handleCreateSubtask} className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Subtask name..."
                    autoFocus
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-[#F4EFEA] border-none focus:bg-white focus:ring-1 focus:ring-[#FF5D38] outline-none"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#FF5D38] text-white hover:opacity-90"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSubtaskInput(false)}
                    className="text-xs text-[#716E69] hover:text-[#27272A]"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddSubtaskInput(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8B5CF6] hover:underline pt-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Subtask</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons (Right-aligned) */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {/* Start Focus Sprint */}
          {!task.completed && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onStartFocus(task);
              }}
              title="Start Deep Focus Sprint on this task"
              className="p-1.5 rounded-full text-[#FF5D38] hover:bg-[#FF5D38]/10 transition-colors"
            >
              <Play className="w-4 h-4 fill-[#FF5D38]" />
            </button>
          )}

          {/* Edit Task */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onEditTask(task);
            }}
            title="Edit task"
            className="p-1.5 rounded-full text-[#716E69] hover:text-[#27272A] hover:bg-[#F4EFEA] transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Task */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onDeleteTask(task.id);
            }}
            title="Delete task"
            className="p-1.5 rounded-full text-[#716E69] hover:text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
