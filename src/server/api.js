import express from "express"
import indexRoutes from "./routes/index"

const api = express.Router();
api.use('/', indexRoutes);

export default api;