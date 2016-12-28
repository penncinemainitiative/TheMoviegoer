import express from "express"
import indexRoutes from "./routes/index"
import searchRoutes from "./routes/search"
import consoleRoutes from "./routes/console"
import authorRoutes from "./routes/author"
import articleRoutes from "./routes/article"

const api = express.Router();
api.use('/', indexRoutes);
api.use('/search', searchRoutes);
api.use('/console', consoleRoutes);
api.use('/author', authorRoutes);
api.use('/article', articleRoutes);

export default api;