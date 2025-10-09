// src/components/Column.jsx
import React from 'react';

function Column({ title, tasks, columnId, onAddTask, showAddButton }) {
  return (
    <div className="column-wrapper">
      <div className="column-title">
        <p>{title}</p>
        {showAddButton && (
          <button 
            className="add-button" 
            onClick={() => onAddTask(columnId)}
          >
            +
          </button>
        )}
      </div>
      <div className="column" id={columnId}>
        {tasks.map(task => (
          <div key={task.id} className="task">
            {task.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Column;