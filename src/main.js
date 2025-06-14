import express from "express";
import { config } from "dotenv";
import { connectDB } from "./db/index.js";
import adminRouter from "./routes/admin.route.js";
import doctorRouter from "./routes/doctor.route.js";
import graphRouter from "./routes/graph.route.js";

config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
await connectDB();

app.use('/admin', adminRouter);
app.use('/doctor', doctorRouter);
app.use('/graph', graphRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});