 function handleDragStart(e, task, columnId) {
    setDraggedTask(task);
    setDraggedFrom(columnId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e) {
    e.preventDefault(); // иначе drop не сработает
  }

  function handleDrop(e, targetColumnId) {
    e.preventDefault();

    if (!draggedTask || draggedFrom === targetColumnId) return;

    setColumns(prev => {
      const newColumns = { ...prev };

      // убираем из старого столбца
      newColumns[draggedFrom].tasks = newColumns[draggedFrom].tasks.filter(
        t => t !== draggedTask
      );

      // добавляем в новый
      newColumns[targetColumnId].tasks = [
        ...newColumns[targetColumnId].tasks,
        draggedTask
      ];

      return newColumns;
    });

    setDraggedTask(null);
    setDraggedFrom(null);
  }