FROM node:20.12-bullseye-slim as builder

ARG VITE_API_URL=$VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
