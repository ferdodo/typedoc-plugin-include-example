FROM node
WORKDIR /typedoc-plugin-include-example/plugin
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm config set maxsockets 1
RUN npm install
RUN npm audit --audit-level=low
RUN npm outdated typedoc
COPY . .
RUN npm run build

FROM node
WORKDIR /typedoc-plugin-include-example/plugin
COPY --from=0 /typedoc-plugin-include-example/plugin/package.json .
COPY --from=0 /typedoc-plugin-include-example/plugin/dist dist
COPY --from=0 /typedoc-plugin-include-example/plugin/README.md .
RUN npm pack --dry-run

