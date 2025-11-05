FROM node:20-alpine
WORKDIR /app

# Copy các file cần thiết
RUN corepack enable
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install
COPY src ./src
COPY tsconfig.json ./tsconfig.json
RUN pnpm build
EXPOSE 4000

CMD ["pnpm", "dev"]