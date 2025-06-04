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

  return (
    <div className="flex-shrink-0 w-72 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <div className="p-3 border-b border-gray-200 bg-white rounded-t-lg">
        <h2 className="font-medium text-sm text-gray-900">{column.title}</h2>
      </div>
      <div ref={setNodeRef} className="p-2 min-h-[200px]">
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
