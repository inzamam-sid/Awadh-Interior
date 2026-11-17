
const validate = (schema) => async (req, res, next) => {
  try {
    const validatedData = await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    req.body = validatedData.body ?? req.body;

    next();
  } catch (error) {
    next(error);
  }
};

export { validate };
