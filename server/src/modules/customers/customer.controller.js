import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "./customer.service.js";

import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customer.validation.js";


export const createCustomerController =
  async (req, res, next) => {
    try {
      const data =
        createCustomerSchema.parse(
          req.body
        );

      const customer =
        await createCustomer({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          data,
        });

      res.status(201).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  };


export const getCustomersController =
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
        await getCustomers({
          organizationId:
            req.user.organizationId,

          page,

          limit,

          search:
            req.query.search,
        });

      res.status(200).json({
        success: true,
        data: result.customers,
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };


export const getCustomerController =
  async (req, res, next) => {
    try {
      const customer =
        await getCustomerById({
          organizationId:
            req.user.organizationId,

          customerId:
            req.params.id,
        });

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  };


export const updateCustomerController =
  async (req, res, next) => {
    try {
      const data =
        updateCustomerSchema.parse(
          req.body
        );

      const customer =
        await updateCustomer({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          customerId:
            req.params.id,

          data,
        });

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  };


export const deleteCustomerController =
  async (req, res, next) => {
    try {
      await deleteCustomer({
        organizationId:
          req.user.organizationId,

        customerId:
          req.params.id,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };