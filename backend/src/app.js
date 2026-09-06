import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import crewAssignmentRouter from "./routes/crewAssignment.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import routeRouter from "./routes/route.routes.js";
import scheduleRouter from "./routes/schedule.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/routes", routeRouter);
app.use("/api/v1/schedules", scheduleRouter);
app.use("/api/v1/assignments", crewAssignmentRouter);

app.use(errorHandler);

export {app};