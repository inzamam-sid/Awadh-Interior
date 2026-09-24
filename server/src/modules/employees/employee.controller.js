import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "./employee.service.js";

import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "./employee.validation.js";


// ======================================================
// CREATE
// ======================================================

export const createEmployeeController =
  async (req, res, next) => {
    try {
      const data =
        createEmployeeSchema.parse(
          req.body
        );

      const employee =
        await createEmployee({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          data,
        });

      res.status(201).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  };


// ======================================================
// LIST
// ======================================================

export const getEmployeesController =
  async (req, res, next) => {
    try {
      const page = Math.max(
        Number(req.query.page) || 1,
        1
      );

      const limit = Math.min(
        Math.max(
          Number(req.query.limit) || 20,
          1
        ),
        100
      );

      const result =
        await getEmployees({
          organizationId:
            req.user.organizationId,

          page,

          limit,

          status:
            req.query.status,

          department:
            req.query.department,

          search:
            req.query.search,
        });

      res.status(200).json({
        success: true,
        data: result.employees,
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };


// ======================================================
// GET ONE
// ======================================================

export const getEmployeeController =
  async (req, res, next) => {
    try {
      const employee =
        await getEmployeeById({
          organizationId:
            req.user.organizationId,

          employeeId:
            req.params.id,
        });

      res.status(200).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  };


// ======================================================
// UPDATE
// ======================================================

export const updateEmployeeController =
  async (req, res, next) => {
    try {
      const data =
        updateEmployeeSchema.parse(
          req.body
        );

      const employee =
        await updateEmployee({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          employeeId:
            req.params.id,

          data,
        });

      res.status(200).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  };


// ======================================================
// DELETE
// ======================================================

export const deleteEmployeeController =
  async (req, res, next) => {
    try {
      await deleteEmployee({
        organizationId:
          req.user.organizationId,

        employeeId:
          req.params.id,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };