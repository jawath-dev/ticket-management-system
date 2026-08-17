const dashboardRepository = require("../repositories/dashboardRepository");

async function getDashboard(req, res, next) {
  try {
    const total = await dashboardRepository.getTotalCount();
    const statusCounts = await dashboardRepository.getStatusCounts();
    const priorityCounts = await dashboardRepository.getPriorityCounts();
    const categoryCounts = await dashboardRepository.getCategoryCounts();
    const overdue = await dashboardRepository.getOverdueCount();

    res.status(200).json({
      success: true,
      data: {
        total,
        overdue,
        byStatus: statusCounts,
        byPriority: priorityCounts,
        byCategory: categoryCounts,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
