FROM node:20-alpine
WORKDIR /app

# Copy các file cần thiết
RUN corepack enable
COPY package.json ./

RUN yarn install
COPY dist ./dist
COPY tsconfig.json ./tsconfig.json


CMD ["node", "-r", "tsconfig-paths/register", "dist/app.js"]