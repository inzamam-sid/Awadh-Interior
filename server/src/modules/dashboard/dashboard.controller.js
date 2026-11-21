import { getDashboardStats } from "./dashboard.service.js";

export const getDashboardController = async (req, res, next) => {
  try {
    const stats = await getDashboardStats(req.user.organizationId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};