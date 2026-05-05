// Подключаем React
import React from "react";

// Компонент для отображения одной задачи
// Принимает: todo - объект задачи, toggleTask - функция изменения статуса, removeTask - функция удаления
const ToDo = ({ todo, toggleTask, removeTask }) => {
  return (
    // Контейнер для задачи с уникальным ключом
    <div key={todo.id + todo.key} className="item-todo">
      
      {/* Блок с текстом задачи - при клике меняется статус */}
      <div
        onClick={() => toggleTask(todo.id)}  // При клике вызываем переключение статуса
        className={
          todo.complete ? "item-text strike" : "item-text"
          // Если задача выполнена (complete === true), добавляем класс 'strike' для зачеркивания
        }
      >
        {todo.task}  {/* Отображаем текст задачи */}
      </div>

      {/* Кнопка удаления задачи */}
      <div 
        className="item-delete" 
        onClick={() => removeTask(todo.id)}  // При клике вызываем функцию удаления
      >
        x  {/* Крестик для удаления */}
      </div>
    </div>
  );
};

// Экспортируем компонент
export default ToDo;