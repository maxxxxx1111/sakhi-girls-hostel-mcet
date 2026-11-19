var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);

// server/db.ts
var import_promise = __toESM(require("mysql2/promise"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mcet_hostel_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
var pool = null;
function getPool() {
  if (!pool) {
    pool = import_promise.default.createPool(dbConfig);
  }
  return pool;
}
async function checkDatabaseConnection() {
  const status = {
    connected: false,
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database
  };
  try {
    const activePool = getPool();
    const [versionRows] = await activePool.query("SELECT VERSION() AS version");
    const version = versionRows[0]?.version;
    status.serverVersion = version;
    const [tableRows] = await activePool.query("SHOW TABLES");
    const tableList = tableRows.map((r) => Object.values(r)[0]);
    status.tables = tableList;
    status.connected = true;
  } catch (err) {
    status.connected = false;
    status.error = err.message || "Failed to connect to MySQL";
  }
  return status;
}
async function query(sql, params) {
  const activePool = getPool();
  const [results] = await activePool.query(sql, params);
  return results;
}

// server.ts
async function startServer() {
  const app = (0, import_express.default)();
  const isProduction = process.env.NODE_ENV === "production";
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get(["/api/health", "/healthz", "/health"], (_req, res) => {
    res.json({ status: "ok", service: "Nestos Campus Residence Hub" });
  });
  app.get("/api/db/status", async (_req, res) => {
    const status = await checkDatabaseConnection();
    res.json(status);
  });
  app.post("/api/db/query", async (req, res) => {
    const { sql } = req.body;
    if (!sql || typeof sql !== "string") {
      return res.status(400).json({ error: "SQL query string is required" });
    }
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith("DROP DATABASE") || trimmed.startsWith("SHUTDOWN")) {
      return res.status(403).json({ error: "Administrative command restricted" });
    }
    try {
      const startTime = performance.now();
      const results = await query(sql);
      const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));
      res.json({
        success: true,
        executionTimeMs,
        rowCount: Array.isArray(results) ? results.length : 1,
        results
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message || "SQL execution failed",
        code: err.code
      });
    }
  });
  app.get("/api/db/schema-sql", (_req, res) => {
    const schemaPath = import_path.default.join(process.cwd(), "database", "schema.sql");
    if (import_fs.default.existsSync(schemaPath)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.sendFile(schemaPath);
    } else {
      res.status(404).send("schema.sql not found");
    }
  });
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.resolve(process.cwd(), "dist");
    const resolvedDist = import_fs.default.existsSync(import_path.default.join(distPath, "index.html")) ? distPath : import_path.default.resolve(__dirname);
    app.use(import_express.default.static(resolvedDist));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(resolvedDist, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nestos server listening on http://0.0.0.0:${PORT} (${isProduction ? "production" : "development"})`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
