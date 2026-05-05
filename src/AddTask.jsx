// Подключаем React и хук useState для управления состоянием формы
import React, { useState } from "react";

// Компонент формы для добавления новых задач
// Принимает функцию addTask из родительского компонента
const ToDoForm = ({ addTask }) => {

  // Создаем состояние для хранения текста в поле ввода
  // userInput - текущее значение поля
  // setUserInput - функция для обновления значения
  const [userInput, setUserInput] = useState("");

  // Обработчик изменения текста в поле ввода
  // Срабатывает при каждом нажатии клавиши в поле ввода
  const handleChange = (e) => {
    // Получаем текущее значение из поля и сохраняем в состояние
    setUserInput(e.currentTarget.value);
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы (стандартное поведение формы)
    addTask(userInput); // Вызываем переданную функцию addTask с текстом задачи
    setUserInput("");   // Очищаем поле ввода после добавления
  };

  // Обработчик нажатия клавиши Enter
  const handleKeyPress = (e) => {
    // Если нажата клавиша Enter
    if (e.key === "Enter") {
      handleSubmit(e); // Вызываем отправку формы
    }
  };

  // Возвращаем JSX разметку формы
  return (
    <form onSubmit={handleSubmit}>
      {/* Поле ввода текста задачи */}
      <input
        value={userInput}              // Значение поля берем из состояния
        type="text"                    // Тип поля - текстовый
        onChange={handleChange}        // Обработчик изменения текста
        onKeyDown={handleKeyPress}     // Обработчик нажатия клавиш
        placeholder="Введите значение..." // Подсказка в поле
      />
      {/* Кнопка отправки формы */}
      <button>Сохранить</button>
    </form>
  );
};

// Экспортируем компонент для использования в App.jsx
export default ToDoForm;