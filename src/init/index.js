import { addGameSession } from "../sessions/game.session.js";
import { testDbConnection } from "../utils/db/testConnection.js";
import { loadProtos } from "./loadProto.js";
import { v4 as uuidv4 } from "uuid";

const initServer = async () => {
  try {
    await loadProtos();
    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);
    await testDbConnection();
    // 다음 작업
  } catch (e) {
    console.error(e);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
