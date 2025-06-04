import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType, Task } from '@/types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  onEditTask: (task: Task) => void;
}

export function Column({ column, onEditTask }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (    <div className="flex-shrink-0 w-80 bg-gray-50/50 rounded-xl shadow-sm border border-gray-200 backdrop-blur-sm">
      <div className="p-4 border-b border-gray-200 bg-white/80 rounded-t-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">{column.title}</h2>
          <span className="text-sm text-gray-500">{column.tasks.length} tasks</span>
        </div>
      </div>
      <div ref={setNodeRef} className="p-3 min-h-[200px]">
        <SortableContext
          items={column.tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
            />
          ))}
          {column.tasks.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              No tasks yet
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
