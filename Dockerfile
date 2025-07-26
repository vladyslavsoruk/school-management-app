FROM node:18

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npx prisma migrate reset --force

RUN npm run build

EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]