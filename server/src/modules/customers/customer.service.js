import Customer from "./customer.model.js";
import ApiError from "../../utils/api-error.js";

export const createCustomer = async ({
  organizationId,
  userId,
  data,
}) => {
  const customer =
    await Customer.create({
      organizationId,
      createdBy: userId,
      ...data,
    });

  return customer;
};


export const getCustomers = async ({
  organizationId,
  page = 1,
  limit = 20,
  search,
}) => {
  const filter = {
    organizationId,
  };

  if (search) {
    filter.$or = [
      {
        name: {
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
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip =
    (page - 1) * limit;

  const [customers, total] =
    await Promise.all([
      Customer.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Customer.countDocuments(filter),
    ]);

  return {
    customers,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};


export const getCustomerById =
  async ({
    organizationId,
    customerId,
  }) => {
    const customer =
      await Customer.findOne({
        _id: customerId,
        organizationId,
      });

    if (!customer) {
      throw new ApiError(
        404,
        "CUSTOMER_NOT_FOUND",
        "Customer not found."
      );
    }

    return customer;
  };


export const updateCustomer =
  async ({
    organizationId,
    userId,
    customerId,
    data,
  }) => {
    const customer =
      await Customer.findOneAndUpdate(
        {
          _id: customerId,
          organizationId,
        },
        {
          ...data,
          updatedBy: userId,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!customer) {
      throw new ApiError(
        404,
        "CUSTOMER_NOT_FOUND",
        "Customer not found."
      );
    }

    return customer;
  };


export const deleteCustomer =
  async ({
    organizationId,
    customerId,
  }) => {
    const customer =
      await Customer.findOneAndDelete({
        _id: customerId,
        organizationId,
      });

    if (!customer) {
      throw new ApiError(
        404,
        "CUSTOMER_NOT_FOUND",
        "Customer not found."
      );
    }

    return customer;
  };