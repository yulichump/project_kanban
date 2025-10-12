// 🎯 ТОЧНАЯ СТРУКТУРА - КОПИРУЙ И РАБОТАЙ!
import React, { useState } from 'react';

const DragDropComponent = () => {
  // === 1. ДАННЫЕ ===
  const [tasks, setTasks] = useState({
    todo: [{id: 1, text: 'Задача 1'}],
    progress: [],
    done: []
  });
  const [draggedItem, setDraggedItem] = useState(null);

  // === 2. ФУНКЦИИ - 3 ОСНОВНЫЕ ===
  
  // Функция 1: НАЧАЛО перетаскивания
  const handleDragStart = (e, task, fromColumn) => {
    setDraggedItem({...task, fromColumn});
    e.dataTransfer.effectAllowed = 'move';
  };

  // Функция 2: ПЕНОС над областью
  const handleDragOver = (e) => {
    e.preventDefault(); // ⚡ ВАЖНО!
  };

  // Функция 3: БРОСАЕМ элемент
  const handleDrop = (e, toColumn) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    setTasks(prev => {
      // УДАЛИТЬ из старой колонки
      const newTasks = {...prev};
      newTasks[draggedItem.fromColumn] = 
        newTasks[draggedItem.fromColumn].filter(t => t.id !== draggedItem.id);
      
      // ДОБАВИТЬ в новую колонку
      newTasks[toColumn] = [...newTasks[toColumn], {
        ...draggedItem,
        fromColumn: undefined
      }];
      
      return newTasks;
    });
    
    setDraggedItem(null);
  };

  // === 3. ИНТЕРФЕЙС ===
  return (
    <div className="columns">
      {/* Колонка 1 */}
      <div 
        className="column"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'todo')}
      >
        <h3>To Do</h3>
        {tasks.todo.map(task => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task, 'todo')}
            className="task"
          >
            {task.text}
          </div>
        ))}
      </div>
      
      {/* Колонка 2 */}  
      <div 
        className="column"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'progress')}
      >
        <h3>In Progress</h3>
        {tasks.progress.map(task => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task, 'progress')}
            className="task"
          >
            {task.text}
          </div>
        ))}
      </div>
      
      {/* Колонка 3 */}
      <div 
        className="column" 
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'done')}
      >
        <h3>Done</h3>
        {tasks.done.map(task => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task, 'done')}
            className="task"
          >
            {task.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DragDropComponent;