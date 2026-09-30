const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes")

const app = express();
app.use(cors());
app.use(express.json());

app.get("/" , (req ,res) => {
    res.json({
        message:"Task management api is running",
    });
});

app.use("/api/auth" , authRoutes);
app.use("/api/projects" ,projectRoutes);
app.use("/api" , taskRoutes);

module.exports = app;

