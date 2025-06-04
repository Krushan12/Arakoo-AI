'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { Board } from '@/components/Board';
import { TaskDialog } from '@/components/TaskDialog';
import { Board as BoardType, Task } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import { subscribeToBoardTasks, addTask, updateTask } from '@/lib/firestore';

const initialBoard: BoardType = {
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [],
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [],
    },
  ],
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [board, setBoard] = useState<BoardType>(initialBoard);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Subscribe to tasks from Firestore
  useEffect(() => {
    if (!user) return;

    try {
      const unsubscribe = subscribeToBoardTasks(
        user.uid,
        (updatedBoard) => {
          setBoard(updatedBoard);
        },
        (error) => {
          console.error('Error subscribing to tasks:', error);
          setError(error instanceof Error ? error.message : 'An error occurred');
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up subscription:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  }, [user]);

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) return;
    try {
      const now = Date.now();
      await addTask(user.uid, {
        ...taskData,
        id: uuidv4(),
        userId: user.uid,
        createdAt: now,
        updatedAt: now,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>) => {
    if (!user) return;
    try {
      // Ensure status and columnId are in sync
      const finalUpdates = {
        ...updates,
        status: (updates.columnId || updates.status) as Task['status'],
        columnId: (updates.status || updates.columnId) as Task['status'],
        updatedAt: Date.now(),
      };

      await updateTask(user.uid, taskId, finalUpdates);
      setIsDialogOpen(false);
      setEditingTask(undefined);
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to update task');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm animate-fade-in">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Tasks</h1>
              <p className="text-sm text-gray-600 mt-1">Organize and track your tasks efficiently</p>
            </div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Task
            </button>
          </div>

          <Board
            board={board}
            onUpdateTask={handleUpdateTask}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsDialogOpen(true);
            }}
          />

          <TaskDialog
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setEditingTask(undefined);
            }}
            onSave={
              editingTask
                ? (updates) => handleUpdateTask(editingTask.id, updates)
                : handleCreateTask
            }
            initialTask={editingTask}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
