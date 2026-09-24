import mongoose from "mongoose";

import Employee from "./employee.model.js";
import User from "../auth/user.model.js";

import ApiError from "../../utils/api-error.js";


// ======================================================
// CREATE
// ======================================================

export const createEmployee = async ({
  organizationId,
  userId,
  data,
}) => {
  const existingEmployee =
    await Employee.findOne({
      organizationId,
      employeeCode:
        data.employeeCode,
    });

  if (existingEmployee) {
    throw new ApiError(
      409,
      "EMPLOYEE_CODE_EXISTS",
      "Employee code already exists."
    );
  }

  if (data.userId) {
    if (
      !mongoose.Types.ObjectId.isValid(
        data.userId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_USER_ID",
        "Invalid user ID."
      );
    }

    const user = await User.findOne({
      _id: data.userId,
      organizationId,
    });

    if (!user) {
      throw new ApiError(
        404,
        "USER_NOT_FOUND",
        "User not found in this organization."
      );
    }

    const existingLink =
      await Employee.findOne({
        organizationId,
        userId: data.userId,
      });

    if (existingLink) {
      throw new ApiError(
        409,
        "USER_ALREADY_LINKED",
        "This user is already linked to an employee."
      );
    }
  }

  const employeeData = {
    ...data,
    organizationId,
    createdBy: userId,
  };

  if (data.joiningDate) {
    employeeData.joiningDate =
      new Date(data.joiningDate);
  }

  const employee =
    await Employee.create(
      employeeData
    );

  return employee;
};


// ======================================================
// LIST
// ======================================================

export const getEmployees = async ({
  organizationId,
  page = 1,
  limit = 20,
  status,
  department,
  search,
}) => {
  const filter = {
    organizationId,
  };

  if (status) {
    filter.status = status;
  }

  if (department) {
    filter.department = department;
  }

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        employeeCode: {
          $regex: search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: search,
          $options: "i",
        },
      },
      {
        designation: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip =
    (page - 1) * limit;

  const [employees, total] =
    await Promise.all([
      Employee.find(filter)
        .populate(
          "userId",
          "name email role isActive"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Employee.countDocuments(filter),
    ]);

  return {
    employees,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};


// ======================================================
// GET ONE
// ======================================================

export const getEmployeeById =
  async ({
    organizationId,
    employeeId,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        employeeId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_EMPLOYEE_ID",
        "Invalid employee ID."
      );
    }

    const employee =
      await Employee.findOne({
        _id: employeeId,
        organizationId,
      }).populate(
        "userId",
        "name email role isActive"
      );

    if (!employee) {
      throw new ApiError(
        404,
        "EMPLOYEE_NOT_FOUND",
        "Employee not found."
      );
    }

    return employee;
  };


// ======================================================
// UPDATE
// ======================================================

export const updateEmployee =
  async ({
    organizationId,
    userId,
    employeeId,
    data,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        employeeId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_EMPLOYEE_ID",
        "Invalid employee ID."
      );
    }

    if (data.employeeCode) {
      const duplicate =
        await Employee.findOne({
          organizationId,

          employeeCode:
            data.employeeCode,

          _id: {
            $ne: employeeId,
          },
        });

      if (duplicate) {
        throw new ApiError(
          409,
          "EMPLOYEE_CODE_EXISTS",
          "Employee code already exists."
        );
      }
    }

    if (data.userId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          data.userId
        )
      ) {
        throw new ApiError(
          400,
          "INVALID_USER_ID",
          "Invalid user ID."
        );
      }

      const user = await User.findOne({
        _id: data.userId,
        organizationId,
      });

      if (!user) {
        throw new ApiError(
          404,
          "USER_NOT_FOUND",
          "User not found in this organization."
        );
      }
    }

    const updateData = {
      ...data,
      updatedBy: userId,
    };

    if (data.joiningDate) {
      updateData.joiningDate =
        new Date(data.joiningDate);
    }

    const employee =
      await Employee.findOneAndUpdate(
        {
          _id: employeeId,
          organizationId,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "userId",
        "name email role isActive"
      );

    if (!employee) {
      throw new ApiError(
        404,
        "EMPLOYEE_NOT_FOUND",
        "Employee not found."
      );
    }

    return employee;
  };


// ======================================================
// DELETE
// ======================================================

export const deleteEmployee =
  async ({
    organizationId,
    employeeId,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        employeeId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_EMPLOYEE_ID",
        "Invalid employee ID."
      );
    }

    const employee =
      await Employee.findOneAndDelete({
        _id: employeeId,
        organizationId,
      });

    if (!employee) {
      throw new ApiError(
        404,
        "EMPLOYEE_NOT_FOUND",
        "Employee not found."
      );
    }

    return employee;
  };