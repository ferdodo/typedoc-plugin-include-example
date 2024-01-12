FROM node
WORKDIR /typedoc-plugin-include-example
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm install
RUN npm audit --audit-level=moderate
COPY . .
RUN npm run build

FROM nginx
COPY --from=0 /typedoc-plugin-include-example/docs /usr/share/nginx/html
