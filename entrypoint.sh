#!/usr/bin/env sh
set -e

# Делаем HOST для Postgres доступным через переменную POSTGRES_HOST
HOST=${POSTGRES_HOST:-postgres}
DATABASE_URL=${DATABASE_URL}

echo "Waiting for PostgreSQL at $HOST:5432..."

# Ждём, пока порт Postgres станет доступным
until nc -z "$HOST" 5432; do
  echo "  still waiting..."
  sleep 1
done

echo "PostgreSQL is up — running migrations and seeding…"

# Прогоняем миграции в режиме продакшн
npx prisma migrate deploy

npx prisma db seed

echo "Migrations and seeds done — starting app."

# Запускаем приложение
exec npm start
