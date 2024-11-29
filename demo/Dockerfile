FROM typedoc-plugin-include-example-plugin AS plugin

FROM node
WORKDIR /typedoc-plugin-include-example/demo
RUN npx playwright install-deps
RUN npm config set maxsockets 1
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm install
RUN npx playwright install
RUN npm audit --audit-level=low

COPY --from=plugin /typedoc-plugin-include-example/plugin /typedoc-plugin-include-example/plugin
WORKDIR /typedoc-plugin-include-example/plugin
RUN npm pack
WORKDIR /typedoc-plugin-include-example/demo
RUN npm install ../plugin/typedoc-plugin-include-example-2.0.1.tgz

COPY . .
RUN npm run build

FROM nginx
COPY --from=1 /typedoc-plugin-include-example/demo/docs /usr/share/nginx/html
