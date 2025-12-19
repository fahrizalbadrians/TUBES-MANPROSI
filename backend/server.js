import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createPoolFromEnv } from "./db.js";
import { initAuth } from "./middleware/auth.js";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import childrenRoutes from "./routes/children.js";
import pregnantRoutes from "./routes/pregnant.js";
import elderlyRoutes from "./routes/elderly.js";
import measurementRoutes from "./routes/measurements.js";
import immunizationRoutes from "./routes/immunizations.js";
import pmtRoutes from "./routes/pmt.js";
import educationRoutes from "./routes/education.js";
import consultRoutes from "./routes/consult.js";
import notificationRoutes from "./routes/notifications.js";
import diagnoseRoutes from "./routes/diagnose.js";

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());

const pool = await createPoolFromEnv();
initAuth(pool);

app.get("/api/health", (_req,res)=>res.json({ok:true,time:new Date().toISOString()}));
app.use("/api/diagnose", diagnoseRoutes(pool));
app.use("/api/auth", authRoutes(pool));
app.use("/api/users", usersRoutes(pool));
app.use("/api/children", childrenRoutes(pool));
app.use("/api/pregnant", pregnantRoutes(pool));
app.use("/api/elderly", elderlyRoutes(pool));
app.use("/api/measurements", measurementRoutes(pool));
app.use("/api/immunizations", immunizationRoutes(pool));
app.use("/api/pmt", pmtRoutes(pool));
app.use("/api/education", educationRoutes(pool));
app.use("/api/consult", consultRoutes(pool));
app.use("/api/notifications", notificationRoutes(pool));

// Fallback 404
app.use((req,res)=>{
  res.status(404).json({message:`Route not found: ${req.method} ${req.path}`});
});

// Error handler (untuk route sync). Untuk async, kita sudah try/catch di routes.
app.use((err, _req, res, _next)=>{
  console.error("Unhandled error:", err);
  res.status(500).json({message:"Server error", detail:String(err?.message||err)});
});

process.on('unhandledRejection', (reason)=>{
  console.error('UnhandledRejection:', reason);
});
process.on('uncaughtException', (err)=>{
  console.error('UncaughtException:', err);
});

const port=Number(process.env.PORT||4000);
app.listen(port, ()=>console.log(`✅ Backend running: http://localhost:${port}`));
