const prisma = require("../config/prisma");

// CREATE PROJECT

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Project title is required",
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        ownerId: req.user.id,
      },
    });

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ALL PROJECTS

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        ownerId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      projects,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET PROJECT BY ID

const getProjectById = async (req, res) => {
  try {
    const projectId = Number(req.params.id);

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

    return res.json({
      project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE PROJECT

const updateProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const { title, description } = req.body;

    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.user.id,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        title,
        description,
      },
    });

    return res.json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE PROJECT

const deleteProject = async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.user.id,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};