# multi stage : react 에서 빌드 한 후, nginx 빌드 파일 복사, 
# 최종적으로 nginx 중심으로 컨테이너 설계
## nginx가 제공을 해줄 build 파일들을 생성하는 단계
### as builder 해당 단계(스테이지)를 `builder` 라고 명시
FROM node:16-alpine as builder
WORKDIR /project/video-platform-admin
COPY ./package.json ./
RUN npm install --force
COPY . .
RUN npm run build

# nginx를 가동하고 윗 단계에서 생성된 빌드 파일들을 제공해주는 단계
FROM nginx
EXPOSE 5000 

## default.conf 에서 해준 설정을 nginx 컨테이너 안에 있는 설정이 되게 복사
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# --from=builder  : 다른 스테이지에 있는 파일을 복사할때 다른 스테이지 이름 명시
# builder 스테이지에 있는 파일을 nginx 에서 도커 컨테이너에 복사
COPY --from=builder /project/video-platform-admin/build  /project/video-platform-admin/build
