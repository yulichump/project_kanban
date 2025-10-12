import { useState, useEffect } from 'react';
import './App.css';
import './components/button.css'
import { useEditTask } from './components/editTask';

function App() {
  const [tasks, setTasks] = useState({
    todo: [],
    progress: [],
    done: []
  });

   // Добавляем состояние для отслеживания первой загрузки
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('kanban-tasks');
      if (savedTasks && savedTasks !== 'null' && savedTasks !== 'undefined') {
        const parsed = JSON.parse(savedTasks);
        setTasks(parsed);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки:', error);
    }
    
    setIsInitialLoad(false);
  }, []);

  // Сохранение в localStorage при изменении задач
  useEffect(() => {
    // Не сохраняем при первой загрузке, чтобы не перезаписать данные из localStorage
    if (isInitialLoad) {
      return;
    }
    try {
      localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('❌ Ошибка сохранения:', error);
    }
  }, [tasks, isInitialLoad]); // Добавляем isInitialLoad в зависимости

   // Используем кастомные хуки
  const {
    editingTask,
    editText,
    setEditText,
    startEditing,
    saveEdit,
    cancelEdit
  } = useEditTask();

  // Проверьте, что при добавлении задачи структура сохраняется
  const addTask = (columnId) => {
    const newTask = {
      id: Date.now(),
      content: 'Новая задача'
    };

    setTasks(prevTasks => {
      const newTasks = {
        ...prevTasks,
        [columnId]: [...prevTasks[columnId], newTask]
      };
      console.log('Новые задачи после добавления:', newTasks);
      return newTasks;
    });
  };

  // Функция удаления задачи
  const deleteTask = (taskId, columnId) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [columnId]: prevTasks[columnId].filter(task => task.id !== taskId)
    }));
  };

  // Компонент для отображения задачи
const Task = ({ task, columnId }) => {
  const isEditing = editingTask && editingTask.id === task.id;
  return (
    <div 
      className="task"
    >
      {isEditing ? (
        // Режим редактирования - здесь перетаскивание запрещено
        <div className="edit-mode">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-input"
            autoFocus
          />
          <div className="edit-buttons">
            <button onClick={() => saveEdit(setTasks)} className="save-button" title='Сохранить'>✓</button>
            <button onClick={() => cancelEdit(setTasks)} className="cancel-button" title="Отменить">
              ×
            </button>
          </div>
        </div>
      ) : (
        // Режим просмотра - ВАЖНО: добавляем pointer-events: none для внутренних элементов
        <div className="task-view" style={{pointerEvents: 'none'}}>
          <span 
            className="task-content"
            onDoubleClick={() => startEditing(task.id, task.content, columnId)}
          >
            {task.content}
          </span>
          <div className="task-actions">
            <button 
              className="edit-button"
              onClick={() => startEditing(task.id, task.content, columnId)}
              title="Редактировать"
              style={{pointerEvents: 'auto'}} // Разрешаем события только для кнопок
            >✎
            </button>
            <button 
              className="delete-button"
              onClick={() => deleteTask(task.id, columnId)}
              title="Удалить задачу"
              style={{pointerEvents: 'auto'}} // Разрешаем события только для кнопок
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

  return (
    <div className='wrapper'>
      <div 
        className='column-wrapper'
      >
        <div className="column-title">
          <p>TO DO</p>
          <button onClick={() => addTask('todo')} className='add-button'>+</button>
        </div>
        <div className="column">
          {tasks.todo.map(task => (
            <Task key={task.id} task={task} columnId="todo" />
          ))}
        </div>
      </div>
     <div 
        className='column-wrapper'
      >
        <div className="column-title">
          <p>PROGRESS</p>
        </div>
        <div className="column"        >
          {tasks.progress.map(task => (
            <Task key={task.id} task={task} columnId="progress" />
          ))}
        </div>
      </div>

      <div 
        className='column-wrapper'
      >
        <div className="column-title">
          <p>DONE</p>
        </div>
        <div className="column">
          {tasks.done.map(task => (
            <Task key={task.id} task={task} columnId="done" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;