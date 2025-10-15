import { useState } from 'react';

export const useEditTask = () => {
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');

  // Начало редактирования
  const startEditing = (taskId, currentContent, columnId) => {
    setEditingTask({ id: taskId, columnId });
    setEditText(currentContent);
  };

  // Сохранение изменений
  const saveEdit = (setTasks) => {
    if (!editingTask) return;

    setTasks(prevTasks => ({
      ...prevTasks,
      [editingTask.columnId]: prevTasks[editingTask.columnId].map(task =>
        task.id === editingTask.id ? { ...task, content: editText } : task
      )
    }));

    setEditingTask(null);
    setEditText('');
  };

  // Отмена редактирования
  const cancelEdit = () => {
    setEditingTask(null);
    setEditText('');
  };

  return {
    editingTask,
    editText,
    setEditText,
    startEditing,
    saveEdit,
    cancelEdit
  };
};