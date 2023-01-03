FROM node:10
WORKDIR /app
COPY frontend/package.json /app
COPY ./frontend /app
RUN npm install
CMD ["npm", "run", "start"]