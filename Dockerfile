FROM node:20.12-bullseye-slim as builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
