import express from "express"
import indexRoutes from "./routes/index"
import searchRoutes from "./routes/search"
import consoleRoutes from "./routes/console"
import authorRoutes from "./routes/author"
import articleRoutes from "./routes/article"
import aboutRoutes from "./routes/about"

const api = express.Router();
api.use('/', indexRoutes);
api.use('/search', searchRoutes);
api.use('/console', consoleRoutes);
api.use('/author', authorRoutes);
api.use('/article', articleRoutes);
api.use('/about', aboutRoutes);

export default api;