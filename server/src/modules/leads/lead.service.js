import Lead from "./lead.model.js";
import ApiError from "../../utils/api-error.js";
import Customer from "../customers/customer.model.js";

export const createLead = async ({
  organizationId,
  userId,
  data,
}) => {
  const lead = await Lead.create({
    organizationId,
    createdBy: userId,
    ...data,
  });

  return lead;
};

export const getLeads = async ({
  organizationId,
  page = 1,
  limit = 20,
  status,
  source,
  assignedTo,
  search,
}) => {
  const filter = {
    organizationId,
  };

  if (status) {
    filter.status = status;
  }

  if (source) {
    filter.source = source;
  }

  if (assignedTo) {
    filter.assignedTo = assignedTo;
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

  const [leads, total] =
    await Promise.all([
      Lead.find(filter)
        .populate(
          "assignedTo",
          "name email role"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Lead.countDocuments(filter),
    ]);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};

export const getLeadById = async ({
  organizationId,
  leadId,
}) => {
  const lead = await Lead.findOne({
    _id: leadId,
    organizationId,
  }).populate(
    "assignedTo",
    "name email role"
  );

  if (!lead) {
    throw new ApiError(
      404,
      "LEAD_NOT_FOUND",
      "Lead not found."
    );
  }

  return lead;
};

export const updateLead = async ({
  organizationId,
  userId,
  leadId,
  data,
}) => {
  const lead =
    await Lead.findOneAndUpdate(
      {
        _id: leadId,
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

  if (!lead) {
    throw new ApiError(
      404,
      "LEAD_NOT_FOUND",
      "Lead not found."
    );
  }

  return lead;
};

export const deleteLead = async ({
  organizationId,
  leadId,
}) => {
  const lead =
    await Lead.findOneAndDelete({
      _id: leadId,
      organizationId,
    });

  if (!lead) {
    throw new ApiError(
      404,
      "LEAD_NOT_FOUND",
      "Lead not found."
    );
  }

  return lead;
};

export const convertLeadToCustomer =
  async ({
    organizationId,
    userId,
    leadId,
  }) => {
    // Find the lead inside the
    // authenticated organization.
    const lead = await Lead.findOne({
      _id: leadId,
      organizationId,
    });

    if (!lead) {
      throw new ApiError(
        404,
        "LEAD_NOT_FOUND",
        "Lead not found."
      );
    }

    // Prevent duplicate conversion.
    if (lead.convertedCustomerId) {
      throw new ApiError(
        409,
        "LEAD_ALREADY_CONVERTED",
        "This lead has already been converted."
      );
    }

    // A lost lead should not become
    // a customer.
    if (lead.status === "LOST") {
      throw new ApiError(
        400,
        "INVALID_LEAD_STATUS",
        "A lost lead cannot be converted into a customer."
      );
    }

    // Create the customer using
    // information already collected
    // from the lead.
    const customer =
      await Customer.create({
        organizationId,

        name: lead.name,

        phone: lead.phone,

        email: lead.email,

        address: {
          street:
            lead.property?.address || "",

          city:
            lead.property?.city || "",

          state:
            lead.property?.state || "",
        },

        propertyType:
          lead.property?.type || "",

        source:
          lead.source || "",

        notes:
          lead.notes ||
          lead.requirement?.description ||
          "",

        createdBy: userId,
      });

    // Mark the lead as converted.
    lead.status = "WON";

    lead.convertedCustomerId =
      customer._id;

    lead.updatedBy = userId;

    await lead.save();

    return {
      lead,
      customer,
    };
  };