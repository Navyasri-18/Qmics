const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Document = require("./models/Document");
const CAPA = require("./models/CAPA");
const Risk = require("./models/Risk");
const Project = require("./models/Project");
const ActivityLog = require("./models/ActivityLog");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Document.deleteMany();
    await CAPA.deleteMany();
    await Risk.deleteMany();
    await Project.deleteMany();
    await ActivityLog.deleteMany();

    const createdUsers = await User.create([
      {
        username: "CEO User",
        email: "ceo@qmics.com",
        password: "password123",
        role: "CEO",
      },
      {
        username: "Director QMS",
        email: "director@qmics.com",
        password: "password123",
        role: "Director",
      },
      {
        username: "Dept Head",
        email: "head@qmics.com",
        password: "password123",
        role: "DeptHead",
      },
      {
        username: "Quality Engineer",
        email: "engineer@qmics.com",
        password: "password123",
        role: "Engineer",
      },
      {
        username: "Admin User",
        email: "admin@qmics.com",
        password: "password123",
        role: "Admin",
      },
    ]);

    const admin = createdUsers[0]._id;
    const manager = createdUsers[1]._id;
    const employee = createdUsers[2]._id;

    await Document.create([
      {
        title: "SOP-001: Quality Manual",
        fileUrl: "uploads/dummy1.pdf",
        version: "1.0",
        status: "Approved",
        createdBy: manager,
      },
      {
        title: "WI-005: Safety Procedures",
        fileUrl: "uploads/dummy2.pdf",
        version: "2.1",
        status: "Under Review",
        createdBy: manager,
      },
      {
        title: "FORM-102: Incident Report",
        fileUrl: "uploads/dummy3.pdf",
        version: "1.0",
        status: "Draft",
        createdBy: employee,
      },
    ]);

    await CAPA.create([
      {
        title: "Incorrect Labeling on Batch #405",
        rootCause: "Printer misconfiguration",
        dueDate: new Date("2026-03-01"),
        status: "Open",
        assignedTo: manager,
        createdBy: employee,
      },
      {
        title: "Late Calibration of Equipment",
        rootCause: "Scheduler oversight",
        dueDate: new Date("2026-02-10"),
        status: "Overdue",
        assignedTo: manager,
        createdBy: admin,
      },
    ]);

    await Risk.create([
      {
        description: "Server Datacenter Power Failure",
        severity: 9,
        occurrence: 2,
        detection: 8,
        createdBy: manager,
      },
      {
        description: "Raw Material Delay",
        severity: 6,
        occurrence: 4,
        detection: 3,
        createdBy: manager,
      },
    ]);

    await Project.create([
      {
        name: "Enterprise QMS Upgrade",
        client: "Global Pharma Corp",
        description: "Standardizing quality processes across regions",
        stages: [
          {
            stageName: "Requirement",
            status: "Completed",
            startDate: new Date("2026-01-01"),
            endDate: new Date("2026-01-05"),
            approvedBy: createdUsers[0]._id,
          },
          {
            stageName: "Analysis",
            status: "Completed",
            startDate: new Date("2026-01-06"),
            endDate: new Date("2026-01-10"),
            approvedBy: createdUsers[1]._id,
          },
          {
            stageName: "Design",
            status: "In Progress",
            startDate: new Date("2026-01-11"),
          },
          { stageName: "Development", status: "Pending" },
          { stageName: "Testing", status: "Pending" },
          { stageName: "Deployment", status: "Pending" },
          { stageName: "Closed", status: "Pending" },
        ],
        currentStage: "Design",
        createdBy: createdUsers[0]._id,
      },
    ]);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
