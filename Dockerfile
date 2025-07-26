FROM node:18

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma migrate dev
RUN npx prisma db seed

RUN npm run build

EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]