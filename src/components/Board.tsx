import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column } from './Column';
import { Board as BoardType, Task } from '@/types';

interface BoardProps {
  board: BoardType;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
}

export function Board({ board, onUpdateTask, onEditTask }: BoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = board.columns
      .flatMap((col) => col.tasks)
      .find((t) => t.id === active.id);
    
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeColumn = board.columns.find(col => 
      col.tasks.some(task => task.id === active.id)
    );
    const overColumn = board.columns.find(col => col.id === over.id);

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    const task = activeColumn.tasks.find(t => t.id === active.id);
    if (!task) return;

    // Update both columnId and status when dragging between columns
    const getStatus = (columnId: string): Task['status'] => {
      switch (columnId) {
        case 'todo': return 'todo';
        case 'in-progress': return 'in-progress';
        case 'done': return 'done';
        default: return 'todo';
      }
    };

    onUpdateTask(task.id, {
      columnId: overColumn.id,
      status: getStatus(overColumn.id)
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {board.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </DndContext>
  );
}
