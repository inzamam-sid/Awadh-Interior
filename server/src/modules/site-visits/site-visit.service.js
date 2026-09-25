import mongoose from "mongoose";

import SiteVisit from "./site-visit.model.js";
import Lead from "../leads/lead.model.js";
import Customer from "../customers/customer.model.js";
import Organization from "../organizations/organization.model.js";
import Employee from "../employees/employee.model.js";

import ApiError from "../../utils/api-error.js";

export const createSiteVisit = async ({
  organizationId,
  userId,
  data,
}) => {
  if (!data.leadId && !data.customerId) {
    throw new ApiError(
      400,
      "LEAD_OR_CUSTOMER_REQUIRED",
      "A lead or customer is required."
    );
  }

  if (
    data.leadId &&
    !mongoose.Types.ObjectId.isValid(
      data.leadId
    )
  ) {
    throw new ApiError(
      400,
      "INVALID_LEAD_ID",
      "Invalid lead ID."
    );
  }

  if (
    data.customerId &&
    !mongoose.Types.ObjectId.isValid(
      data.customerId
    )
  ) {
    throw new ApiError(
      400,
      "INVALID_CUSTOMER_ID",
      "Invalid customer ID."
    );
  }

  if (data.assignedTo) {
    if (
      !mongoose.Types.ObjectId.isValid(
        data.assignedTo
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
        _id: data.assignedTo,
        organizationId,
      });

    if (!employee) {
      throw new ApiError(
        404,
        "EMPLOYEE_NOT_FOUND",
        "Employee not found in this organization."
      );
    }

    if (employee.status !== "ACTIVE") {
      throw new ApiError(
        400,
        "EMPLOYEE_NOT_ACTIVE",
        "Only active employees can be assigned."
      );
    }
  }

  if (data.leadId) {
    const lead = await Lead.findOne({
      _id: data.leadId,
      organizationId,
    });

    if (!lead) {
      throw new ApiError(
        404,
        "LEAD_NOT_FOUND",
        "Lead not found."
      );
    }
  }

  if (data.customerId) {
    const customer =
      await Customer.findOne({
        _id: data.customerId,
        organizationId,
      });

    if (!customer) {
      throw new ApiError(
        404,
        "CUSTOMER_NOT_FOUND",
        "Customer not found."
      );
    }
  }

  const siteVisit =
    await SiteVisit.create({
      organizationId,
      createdBy: userId,
      ...data,
      scheduledAt: new Date(
        data.scheduledAt
      ),
    });

  return siteVisit;
};

export const getSiteVisits = async ({
  organizationId,
  page = 1,
  limit = 20,
  status,
  assignedTo,
  from,
  to,
}) => {
  const filter = {
    organizationId,
  };

  if (status) {
    filter.status = status;
  }

  if (assignedTo) {
    filter.assignedTo = assignedTo;
  }

  if (from || to) {
    filter.scheduledAt = {};

    if (from) {
      filter.scheduledAt.$gte =
        new Date(from);
    }

    if (to) {
      filter.scheduledAt.$lte =
        new Date(to);
    }
  }

  const skip =
    (page - 1) * limit;

  const [siteVisits, total] =
    await Promise.all([
      SiteVisit.find(filter)
        .populate(
          "leadId",
          "name phone email status"
        )
        .populate(
          "customerId",
          "name phone email"
        )
        .populate(
          "assignedTo",
          "employeeCode name phone designation department status"
        )
        .sort({
          scheduledAt: 1,
        })
        .skip(skip)
        .limit(limit),

      SiteVisit.countDocuments(filter),
    ]);

  return {
    siteVisits,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};

export const getSiteVisitById =
  async ({
    organizationId,
    siteVisitId,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        siteVisitId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_SITE_VISIT_ID",
        "Invalid site visit ID."
      );
    }

    const siteVisit =
      await SiteVisit.findOne({
        _id: siteVisitId,
        organizationId,
      })
        .populate(
          "leadId",
          "name phone email status"
        )
        .populate(
          "customerId",
          "name phone email"
        )
        .populate(
          "assignedTo",
          "employeeCode name phone designation department status"
        );

    if (!siteVisit) {
      throw new ApiError(
        404,
        "SITE_VISIT_NOT_FOUND",
        "Site visit not found."
      );
    }

    return siteVisit;
  };

  export const updateSiteVisit =
  async ({
    organizationId,
    userId,
    siteVisitId,
    data,
  }) => {
    if (data.assignedTo) {
      if (
        !mongoose.Types.ObjectId.isValid(
          data.assignedTo
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
          _id: data.assignedTo,
          organizationId,
        });

      if (!employee) {
        throw new ApiError(
          404,
          "EMPLOYEE_NOT_FOUND",
          "Employee not found in this organization."
        );
      }

      if (employee.status !== "ACTIVE") {
        throw new ApiError(
          400,
          "EMPLOYEE_NOT_ACTIVE",
          "Only active employees can be assigned."
        );
      }
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        siteVisitId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_SITE_VISIT_ID",
        "Invalid site visit ID."
      );
    }

    if (
      data.assignedTo &&
      !mongoose.Types.ObjectId.isValid(
        data.assignedTo
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_ASSIGNED_USER_ID",
        "Invalid assigned user ID."
      );
    }

    const updateData = {
      ...data,
      updatedBy: userId,
    };

    if (data.scheduledAt) {
      updateData.scheduledAt =
        new Date(data.scheduledAt);
    }

    const siteVisit =
      await SiteVisit.findOneAndUpdate(
        {
          _id: siteVisitId,
          organizationId,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
      .populate(
      "assignedTo",
      "employeeCode name phone designation department status"
    )
    .populate(
      "leadId",
      "name phone email status"
    )
    .populate(
      "customerId",
      "name phone email"
    );

    if (!siteVisit) {
      throw new ApiError(
        404,
        "SITE_VISIT_NOT_FOUND",
        "Site visit not found."
      );
    }

    return siteVisit;
  };



  export const deleteSiteVisit =
  async ({
    organizationId,
    siteVisitId,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        siteVisitId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_SITE_VISIT_ID",
        "Invalid site visit ID."
      );
    }

    const siteVisit =
      await SiteVisit.findOneAndDelete({
        _id: siteVisitId,
        organizationId,
      });

    if (!siteVisit) {
      throw new ApiError(
        404,
        "SITE_VISIT_NOT_FOUND",
        "Site visit not found."
      );
    }

    return siteVisit;
  };

  export const createPublicSiteVisit =
  async (data) => {
    const organization =
      await Organization.findOne({
        slug:
          process.env.ORGANIZATION_SLUG,
        isActive: true,
      });

    if (!organization) {
      throw new ApiError(
        500,
        "ORGANIZATION_NOT_CONFIGURED",
        "Public booking is not configured."
      );
    }

    const lead =
      await Lead.create({
        organizationId:
          organization._id,

        name: data.name,

        phone: data.phone,

        email: data.email || "",

        source: "WEBSITE",

        status: "SITE_VISIT",

        requirement: {
          description:
            data.requirement || "",
        },

        property: {
          type:
            data.propertyType || "",

          address:
            data.address?.street || "",

          city:
            data.address?.city || "",

          state:
            data.address?.state || "",
        },
      });

    const siteVisit =
      await SiteVisit.create({
        organizationId:
          organization._id,

        leadId: lead._id,

        scheduledAt:
          new Date(data.scheduledAt),

        address:
          data.address || {},

        status: "SCHEDULED",
      });

    return {
      lead,
      siteVisit,
    };
  };