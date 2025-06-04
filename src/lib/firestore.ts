import { 
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  DocumentData,
  FirestoreError
} from 'firebase/firestore';
import { db } from './firebase';
import { Board, Task } from '@/types';

type FirestoreErrorHandler = (error: FirestoreError) => void;

export const subscribeToBoardTasks = (
  userId: string,
  onUpdate: (board: Board) => void,
  onError?: FirestoreErrorHandler
) => {
  if (!userId) {
    const error = new Error('No userId provided to subscribeToBoardTasks');
    console.error(error);
    onError?.(error as FirestoreError);
    return () => {};
  }

  const tasksRef = collection(db, 'tasks');
  // Temporarily remove ordering until index is created
  const q = query(
    tasksRef,
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      try {
        const tasks = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as Task[];

        const board: Board = {
          columns: [
            {
              id: 'todo',
              title: 'To Do',
              tasks: tasks.filter(task => task.status === 'todo' || task.columnId === 'todo'),
            },
            {
              id: 'in-progress',
              title: 'In Progress',
              tasks: tasks.filter(task => task.status === 'in-progress' || task.columnId === 'in-progress'),
            },
            {
              id: 'done',
              title: 'Done',
              tasks: tasks.filter(task => task.status === 'done' || task.columnId === 'done'),
            },
          ],
        };

        onUpdate(board);
      } catch (error) {
        console.error('Error processing tasks:', error);
        onError?.(error as FirestoreError);
      }
    },
    (error) => {
      console.error('Error subscribing to tasks:', error);
      onError?.(error);
    }
  );
};

export const addTask = async (userId: string, task: Task): Promise<boolean> => {
  if (!userId || !task) {
    throw new Error('Invalid task data');
  }

  try {
    const taskRef = doc(collection(db, 'tasks'));
    await setDoc(taskRef, {
      ...task,
      userId,
    });
    return true;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const updateTask = async (
  userId: string,
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'userId'>>
): Promise<boolean> => {
  if (!userId || !taskId) {
    throw new Error('Invalid update data');
  }

  try {
    const taskRef = doc(db, 'tasks', taskId);
    const updateData = {
      ...updates,
      userId,
      updatedAt: Date.now(),
      // Ensure status and columnId are always in sync
      ...(updates.status && { columnId: updates.status }),
      ...(updates.columnId && { status: updates.columnId })
    };
    await setDoc(taskRef, updateData, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  if (!taskId) {
    throw new Error('Invalid task ID');
  }

  try {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
