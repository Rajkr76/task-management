const express = require("express");

const authenticate = require("../middleware/auth.middleware");

const {createTask, getProjectTasks, getTaskById, updateTask, deleteTask,
} = require("../controllers/task.controller");

const router = express.Router();

router.use(authenticate);

// Projects task routes

router.post("/projects/:projectId/tasks", createTask);
router.get("/projects/:projectId/tasks", getProjectTasks);

// Individual task routes

router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

module.exports = router;