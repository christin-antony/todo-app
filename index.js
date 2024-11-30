import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import taskRoutes from './router/taskRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express(); 
const port = 1008;


app.use(cors());
app.use(express.json());

app.use("/", taskRoutes);

app.use(express.static(path.join(__dirname,"frontend/dist")));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"frontend/dist/index.html")));

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Error connecting to MongoDB:", error));

app.listen(port, () => {
    console.log("Server started on port", port);
});