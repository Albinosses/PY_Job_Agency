FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
FROM nginx:alpine as production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "deamon off;" ]