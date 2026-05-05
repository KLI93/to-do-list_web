# Используем облегчённую версию Node.js 22
FROM node:22-slim

# Задаём рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости (включая axios)
RUN npm install

# Копируем все файлы из локального каталога в контейнер
COPY . .

# Открываем порт 5173 (порт Vite по умолчанию)
EXPOSE 5173

# Запускаем приложение в режиме разработки
CMD ["npm", "run", "dev", "--", "--host"]