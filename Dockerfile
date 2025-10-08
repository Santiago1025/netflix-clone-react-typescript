FROM node:16.17.0-alpine as builder
WORKDIR /app

# Copiar dependencias
COPY ./package*.json ./

# Instalar dependencias con npm
RUN npm install

# Copiar todo el proyecto
COPY . .

# Pasar la API key como variable
ARG TMDB_V3_API_KEY
ENV VITE_APP_TMDB_V3_API_KEY=${TMDB_V3_API_KEY}
ENV VITE_APP_API_ENDPOINT_URL="https://api.themoviedb.org/3"

# Construir el proyecto
RUN npm run build

# Etapa de producción con nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
