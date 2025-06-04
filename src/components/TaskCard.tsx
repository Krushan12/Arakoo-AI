import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onEdit, isDragging }: TaskCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isSortableDragging ? 0 : 1,
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const priorityColors = {
    low: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200',
    medium: 'bg-yellow-50 text-yellow-600 ring-1 ring-yellow-200',
    high: 'bg-red-50 text-red-600 ring-1 ring-red-200',
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}      className={`
        group mb-3 bg-white rounded-xl shadow-sm
        cursor-grab active:cursor-grabbing border border-gray-100 
        ${isDragging
          ? 'shadow-lg ring-2 ring-blue-100' 
          : 'hover:shadow-lg hover:border-blue-100'
        }
      `}
    >
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
          <div className="flex gap-2">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]} shadow-sm`}>
              {task.priority}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 invisible group-hover:visible hover:bg-blue-50 px-2 py-1 rounded-md transition-colors duration-200 cursor-pointer"
          >
            <PencilIcon className="w-3.5 h-3.5" />
            Edit
          </button>
          {task.assignee && (
            <div className="flex items-center gap-2">
              <img
                src={`https://picsum.photos/seed/${task.id}/24/24`}
                alt={task.assignee}
                className="w-6 h-6 rounded-full ring-2 ring-white"
              />
              <span className="text-xs text-gray-500">{task.assignee}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
