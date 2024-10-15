FROM node
WORKDIR /typedoc-plugin-include-example
RUN npx playwright install-deps
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm config set maxsockets 1
RUN npm install
RUN npm audit --audit-level=moderate
RUN npm outdated typedoc
RUN npx playwright install
COPY . .
RUN npm run build

FROM nginx
COPY --from=0 /typedoc-plugin-include-example/docs /usr/share/nginx/html
