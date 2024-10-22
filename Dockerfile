FROM node AS build
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

FROM node AS publish
WORKDIR /typedoc-plugin-include-example
COPY --from=0 /typedoc-plugin-include-example/package.json .
COPY --from=0 /typedoc-plugin-include-example/npm-shrinkwrap.json .
COPY --from=0 /typedoc-plugin-include-example/dist dist

FROM nginx AS docs
COPY --from=0 /typedoc-plugin-include-example/docs /usr/share/nginx/html
