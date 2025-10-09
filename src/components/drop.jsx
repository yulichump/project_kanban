// hooks/useDragAndDrop.js
import { useState } from 'react';

export function useDragAndDrop(initialTasks, onTasksUpdate) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Начало перетаскивания
  const handleDragStart = (e, taskId, fromColumn) => {
    setDraggedTask({ id: taskId, fromColumn });
    e.dataTransfer.setData('text/plain', taskId);
    e.currentTarget.style.opacity = '0.5';
  };

  // Завершение перетаскивания
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  // Разрешаем дроп
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Когда заходим в колонку
  const handleDragEnter = (columnId) => {
    setDragOverColumn(columnId);
  };

  // Когда выходим из колонки
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  // Обработка дропа
  const handleDrop = (e, toColumn) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    const taskId = draggedTask.id;
    const fromColumn = draggedTask.fromColumn;

    // Если перемещаем в другую колонку
    if (fromColumn !== toColumn) {
      // Находим задачу которую перемещаем
      const taskToMove = initialTasks[fromColumn].find(t => t.id == taskId);
      
      // Удаляем из старой колонки
      const newFromColumn = initialTasks[fromColumn].filter(t => t.id != taskId);
      
      // Добавляем в новую колонку
      const newToColumn = [...initialTasks[toColumn], taskToMove];

      // Обновляем задачи
      onTasksUpdate({
        ...initialTasks,
        [fromColumn]: newFromColumn,
        [toColumn]: newToColumn
      });
    }

    setDraggedTask(null);
    setDragOverColumn(null);
  };

  return {
    draggedTask,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop
  };
}