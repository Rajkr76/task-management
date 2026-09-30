const prisma = require("../config/prisma");

// CREATE TASK

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      title,
      description,
      assignedUserId,
      status,
      priority,
      dueDate,
    } = req.body;

    // Check required field

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: Number(projectId),
        ownerId: req.user.id,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // If a user is assigned, make sure that user exists

    if (assignedUserId) {
      const assignedUser = await prisma.user.findUnique({
        where: {
          id: Number(assignedUserId),
        },
      });

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId: Number(projectId),
        assignedUserId: assignedUserId
          ? Number(assignedUserId)
          : null,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ALL TASKS FOR PROJECT

const getProjectTasks = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.user.id,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      tasks,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET TASK BY ID

const getTaskById = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          ownerId: req.user.id,
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json({
      task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE TASK

const updateTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    const {
      title,
      description,
      assignedUserId,
      status,
      priority,
      dueDate,
    } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          ownerId: req.user.id,
        },
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (assignedUserId) {
      const assignedUser = await prisma.user.findUnique({
        where: {
          id: Number(assignedUserId),
        },
      });

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        description,
        assignedUserId: assignedUserId
          ? Number(assignedUserId)
          : null,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE TASK

const deleteTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          ownerId: req.user.id,
        },
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
};