import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import protobuf from "protobufjs";
import { packetNames } from "../protobuf/packetName.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoDir = path.join(__dirname, "../protobuf");

const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // 만약 파일경로가 디렉토리면
      getAllProtoFiles(filePath, fileList); // 한번더 안으로 들어가기
    } else if (path.extname(file) === ".proto") {
      // .proto파일이다
      fileList.push(filePath); // filelist에 proto 파일 추가해준다.
    }
  });
  return fileList;
};

const protoFiles = getAllProtoFiles(protoDir);
const protoMessages = {};

export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    await Promise.all(protoFiles.map((file) => root.load(file)));

    for (const [packageName, types] of Object.entries(packetNames)) {
      protoMessages[packageName] = {};
      for (const [type, typeName] of Object.entries(types)) {
        protoMessages[packageName][type] = root.lookupType(typeName);
      }
    }
    console.log("protobuf 파일 로드 성공");
  } catch (error) {
    console.error("protobuf 파일을 불러오는 중 오류가 발생했습니다", error);
  }
};

export const getProtoMessages = () => {
  return { ...protoMessages };
};