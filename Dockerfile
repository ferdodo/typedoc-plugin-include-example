FROM node AS build
WORKDIR /typedoc-plugin-include-example
RUN npx playwright install-deps
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm config set maxsockets 1
RUN npm install
RUN npm audit --audit-level=low
RUN npm outdated typedoc
RUN npx playwright install
COPY . .
RUN npm run build

FROM node AS publish
WORKDIR /typedoc-plugin-include-example
COPY --from=0 /typedoc-plugin-include-example/package.json .
COPY --from=0 /typedoc-plugin-include-example/npm-shrinkwrap.json .
COPY --from=0 /typedoc-plugin-include-example/dist dist
COPY --from=0 /typedoc-plugin-include-example/README.md .
COPY --from=0 /typedoc-plugin-include-example/LICENSE .
COPY --from=0 /typedoc-plugin-include-example/CONTRIBUTING.md .
COPY --from=0 /typedoc-plugin-include-example/CODE_OF_CONDUCT.md .
RUN npm pack --dry-run
ENTRYPOINT ["/bin/bash"]

FROM nginx AS docs
COPY --from=0 /typedoc-plugin-include-example/docs /usr/share/nginx/html
