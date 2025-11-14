FROM oven/bun:alpine
WORKDIR /app

COPY package.json ./
COPY bun.lock ./

RUN bun install --frozen-lockfile
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY entrypoint.sh ./entrypoint.sh
RUN bun run build
EXPOSE 4000

CMD ["bun", "run", "start"]
