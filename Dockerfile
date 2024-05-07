FROM node:20.12-bullseye-slim as builder

ARG API_URL="https://meme-api-project.azurewebsites.net"

ENV VITE_API_URL=$API_URL

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
