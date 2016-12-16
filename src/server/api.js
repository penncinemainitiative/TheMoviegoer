import express from "express"
import indexRoutes from "./routes/index"
import searchRoutes from "./routes/search"

const api = express.Router();
api.use('/', indexRoutes);
api.use('/search', searchRoutes);

export default api;