FROM node
WORKDIR /typedoc-plugin-include-example
RUN npx playwright install-deps
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm install
RUN npm audit --audit-level=moderate
RUN npx playwright install
COPY . .
RUN npm run build

FROM nginx
COPY --from=0 /typedoc-plugin-include-example/docs /usr/share/nginx/html
