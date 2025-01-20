# 使用 Node.js 作為基底映像
FROM node:18-alpine AS build

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安裝依賴
RUN npm install

# 複製專案檔案
COPY . .

# 建置 Vite 應用程式
RUN npm run build

# 使用輕量化的 Nginx 映像作為執行環境
FROM nginx:alpine

# 複製建置的檔案到 Nginx 預設靜態檔案目錄
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露預設 Nginx 的埠
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]

