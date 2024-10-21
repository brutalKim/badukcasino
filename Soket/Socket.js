const express = require("express");  //express를 가져와 변수에 저장
const http = require("http");  //서버의 정보
const app = express();  //express를 실행한 값을 app에 저장
const path = require("path");// 서버 경로를 저장한 변수
const server = http.createServer(app);

const socketIO = require("socket.io");
const io = socketIO(server);