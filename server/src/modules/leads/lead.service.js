import Lead from "./lead.model.js";
import ApiError from "../../utils/api-error.js";

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