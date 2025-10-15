import { useState } from 'react';

export const useDropTask = () => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  
  function handleDragStart(e, task, columnId) {
    setDraggedTask(task);
    setDraggedFrom(columnId);
    e.dataTransfer.effectAllowed = "move";
    }

  function handleDragOver(e) {
    e.preventDefault(); // иначе drop не сработает
  };

  function handleDrop(e, targetColumnId, setTasks) {
    e.preventDefault();

    if (!draggedTask || draggedFrom === targetColumnId) return;

    setTasks(prev => {
      const newTasks = { ...prev };

      // убираем из старого столбца
      newTasks[draggedFrom] = newTasks[draggedFrom].filter(
        t => t.id !== draggedTask.id
      );

      // добавляем в новый
      newTasks[targetColumnId] = [
        ...newTasks[targetColumnId],
        draggedTask
      ];

      return newTasks;
    });

    setDraggedTask(null);
    setDraggedFrom(null);
  };

  return {
    handleDragOver,
    handleDragStart,
    handleDrop,
    setDraggedTask,
    setDraggedFrom,
    draggedFrom,
    draggedTask
  };
};
  