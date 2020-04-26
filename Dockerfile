#FROM golang:1.13.1-alpine AS GO_BUILD
#COPY server /server
#WORKDIR /server
#RUN go build -o /go/bin/server
#
#
#
#FROM node:12.11 AS ANGULAR_BUILD
#RUN npm install -g @angular/cli@~9.1.1
#COPY Client /Client
#WORKDIR Client
#RUN npm install && ng build --prod
#
#
#
#FROM alpine:3.10
#WORKDIR app
#COPY --from=ANGULAR_BUILD /Client/dist/Client/* ./Client/dist/Client/
#COPY --from=GO_BUILD /go/bin/server ./
#RUN ls
#CMD ./server
