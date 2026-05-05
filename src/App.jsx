// Подключаем необходимые хуки из React
import React, { useState, useEffect } from 'react';
// Подключаем стили
import './App.css';
// Подключаем компоненты для списка задач
import ToDoForm from "./AddTask";
import ToDo from "./Task";
// Подключаем axios для HTTP-запросов
import axios from 'axios';

// Ключ для хранения задач в localStorage
const TASKS_STORAGE_KEY = 'tasks-list-project-web';
// API ключ для погоды (OpenWeatherMap)
const weatherApiKey = 'c7616da4b68205c2f3ae73df2c31d177';

// Главный компонент приложения
function App() {
  // Состояния для Todo-листа
  const [todos, setTodos] = useState([]);  // Массив задач
  
  // Состояния для курса валют и погоды
  const [rates, setRates] = useState({});      // Курсы валют
  const [weatherData, setWeatherData] = useState(null); // Данные о погоде
  const [loading, setLoading] = useState(true); // Статус загрузки
  const [error, setError] = useState('');      // Сообщение об ошибке

  // Эффект для загрузки сохраненных задач из localStorage при запуске
  useEffect(() => {
    // Пытаемся получить сохраненные задачи из браузера
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (savedTasks) {
      // Если есть сохраненные задачи, загружаем их
      setTodos(JSON.parse(savedTasks));
    }
  }, []); // Пустой массив - эффект выполняется только один раз при монтировании

  // Эффект для сохранения задач в localStorage при каждом изменении todos
  useEffect(() => {
    // Сохраняем актуальный список задач в localStorage
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]); // Срабатывает каждый раз, когда todos изменяется

  // Эффект для получения курса валют и погоды
  useEffect(() => {
    // Асинхронная функция для получения всех данных из API
    async function fetchAllData() {
      try {
        // 1. Получаем курс валют с сайта ЦБ РФ
        const currencyResponse = await axios.get(
          'https://www.cbr-xml-daily.ru/daily_json.js'
        );

        // Проверяем, пришли ли данные
        if (!currencyResponse.data || !currencyResponse.data.Valute) {
          throw new Error('Нет данных о валюте.');
        }

        // Извлекаем курс доллара и евро, округляем до 4 знаков, заменяем точку на запятую
        const USDrate = currencyResponse.data.Valute.USD.Value.toFixed(4).replace('.', ',');
        const EURrate = currencyResponse.data.Valute.EUR.Value.toFixed(4).replace('.', ',');

        // Сохраняем курсы в состоянии
        setRates({
          USDrate,
          EURrate
        });

        // 2. Получаем данные о погоде по геолокации пользователя
        // Запрашиваем текущую позицию
        navigator.geolocation.getCurrentPosition(async position => {
          // Получаем широту и долготу
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Делаем запрос к API погоды с координатами
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`
          );

          // Проверяем наличие данных о погоде
          if (!weatherResponse.data.main) {
            throw new Error('Нет данных о погоде.');
          }

          // Сохраняем данные о погоде
          setWeatherData(weatherResponse.data);
        });
      } catch (err) {
        // Обрабатываем ошибки
        console.error(err);
        setError('Ошибка загрузки данных.');
      } finally {
        // В любом случае завершаем загрузку
        setLoading(false);
      }
    }

    // Вызываем функцию получения данных
    fetchAllData();
  }, []); // Пустой массив - выполняется один раз при загрузке

  // Функция для добавления новой задачи
  const addTask = (userInput) => {
    if (userInput) {  // Проверяем, что поле не пустое
      const newItem = {
        id: Math.random().toString(36).substr(2, 9), // Генерируем уникальный ID
        task: userInput,  // Текст задачи
        complete: false   // По умолчанию задача не выполнена
      };
      // Добавляем новую задачу к существующему списку
      setTodos([...todos, newItem]);
    }
  };

  // Функция для удаления задачи по id
  const removeTask = (id) => {
    // Фильтруем массив, оставляя все задачи кроме удаляемой
    setTodos([...todos.filter((todo) => todo.id !== id)]);
  };

  // Функция для переключения статуса задачи (выполнена/не выполнена)
  const handleToggle = (id) => {
    // Проходим по всем задачам и меняем статус нужной
    setTodos([
      ...todos.map((task) =>
        task.id === id ? { ...task, complete: !task.complete } : { ...task }
      )
    ]);
  };

  // Возвращаем JSX разметку (то, что увидит пользователь)
  return (
    <>
     <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="./background-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay"></div> {/* Затемнение */}
      </div>
      
      <div className="App">
        {/* Блок с курсом валют и погодой */}
        {/* Показываем загрузку */}
        {loading && <p>Загрузка...</p>}
        
        {/* Показываем ошибку, если она есть */}
        {!loading && error && <p style={{ color: 'red' }}>{error}</p>}
        
        {/* Если загрузка завершена и ошибок нет - показываем данные */}
        {!loading && !error && (
          <div className='info'>
            {/* Блок с курсами валют */}
            <div className='money'>
              <div id="USD">
                Доллар США $ — {rates.USDrate} руб.
              </div>
              <div id="EUR">
                Евро € — {rates.EURrate} руб.
              </div>
            </div>
            
            {/* Блок с погодой (показываем, если данные загружены) */}
            {weatherData && (
              <div className="weather-info">
                <div>
                  Погода сегодня: <br />
                  {/* Температура в Цельсиях (из Кельвинов) */}
                  🌡️ {(weatherData.main.temp - 273.15).toFixed(1)}°C   
                  {/* Скорость ветра */}
                  ༄.° {weatherData.wind.speed} м/с    
                  {/* Облачность в процентах */}
                  ☁️ {weatherData.clouds.all}%
                </div>
                {/* Иконка погоды с сервера OpenWeatherMap */}
                <img 
                  className='weather-icon' 
                  src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} 
                  alt="Иконка погоды"
                />
              </div>
            )}
          </div>
        )}

        {/* Заголовок списка задач с количеством */}
        <header>
          <h1 className='list-header'>Список задач: {todos.length}</h1>
        </header>

        {/* Форма для добавления новых задач */}
        <ToDoForm addTask={addTask} />

        {/* Список всех задач */}
        {/* Перебираем массив todos и для каждой задачи создаем компонент ToDo */}
        {todos.map((todo) => {
          return (
            <ToDo
              todo={todo}              // Передаем объект задачи
              key={todo.id}            // Уникальный ключ для React
              toggleTask={handleToggle} // Функция изменения статуса
              removeTask={removeTask}   // Функция удаления задачи
            />
          );
        })}
      </div>
    </>
  );
}

// Экспортируем компонент для использования в других файлах
export default App;