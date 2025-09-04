FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci || npm install

COPY public ./public
COPY src ./src

ENV PORT=3000
EXPOSE 3000
# If the backend is in Docker as 'backend' service, set REACT_APP_API_BASE accordingly at run time
CMD ["npm", "start"]
