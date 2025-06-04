import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const priorityColors = {
    low: 'bg-blue-100 text-blue-600',
    medium: 'bg-yellow-100 text-yellow-600',
    high: 'bg-red-100 text-red-600',
  };

  if (!isMounted) {
    return null; // or return a loading skeleton
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group mb-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border border-gray-100"
    >
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            <PencilIcon className="w-3 h-3" />
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
