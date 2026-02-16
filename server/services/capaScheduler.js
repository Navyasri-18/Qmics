const CAPA = require("../models/CAPA");
const ActivityLog = require("../models/ActivityLog");
const CapaHistory = require("../models/CapaHistory");
const NotificationLog = require("../models/NotificationLog");

/**
 * Check for overdue CAPAs and escalate if necessary
 */
const runCapaScheduler = async () => {
  console.log("Running CAPA Scheduler...");
  try {
    const currentDate = new Date();

    // 1. Find Open/In Progress CAPAs that are past due date
    const overdueCapas = await CAPA.find({
      status: { $in: ["Open", "In Progress"] },
      dueDate: { $lt: currentDate },
    });

    for (const capa of overdueCapas) {
      console.log(`Marking CAPA ${capa._id} as Overdue`);
      capa.status = "Overdue";
      capa.isOverdue = true;
      await capa.save();

      // Log history
      await CapaHistory.create({
        capaId: capa._id,
        oldStatus: "Open/In Progress",
        newStatus: "Overdue",
        timestamp: new Date(),
      });

      // Simulation: Send Notification
      await NotificationLog.create({
        recipient: capa.assignedTo ? String(capa.assignedTo) : "Admin",
        message: `CAPA "${capa.title}" is now OVERDUE.`,
        capaId: capa._id,
        type: "Overdue",
      });
    }

    // 2. Handle Escalation for Overdue CAPAs
    const escalatedCapas = await CAPA.find({
      status: { $in: ["Overdue", "Escalated"] },
      isOverdue: true,
      status: { $ne: "Closed" },
    });

    for (const capa of escalatedCapas) {
      const daysOverdue = Math.floor(
        (currentDate - new Date(capa.dueDate)) / (1000 * 60 * 60 * 24),
      );
      let newLevel = capa.escalationLevel;

      if (daysOverdue > 10) newLevel = 3;
      else if (daysOverdue > 5) newLevel = 2;
      else if (daysOverdue > 2) newLevel = 1;

      if (newLevel > capa.escalationLevel) {
        console.log(
          `Escalating CAPA ${capa._id} to Level ${newLevel} (${daysOverdue} days overdue)`,
        );
        capa.escalationLevel = newLevel;
        capa.status = "Escalated";
        await capa.save();

        // Log Notification
        await NotificationLog.create({
          recipient: "Quality Manager", // Simulation
          message: `Escalation Level ${newLevel}: CAPA "${capa.title}" is ${daysOverdue} days overdue.`,
          capaId: capa._id,
          type: "Escalation",
        });

        await ActivityLog.create({
          user: null,
          action: "Escalation",
          module: "CAPA",
          details: `CAPA ${capa.title} escalated to Level ${newLevel}`,
        });
      }
    }

    console.log("CAPA Scheduler Completed.");
  } catch (error) {
    console.error("Error in CAPA Scheduler:", error);
  }
};

module.exports = { runCapaScheduler };
