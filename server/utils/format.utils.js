const formatValidateErrors = errors => {
  if (!errors || errors.issues?.length === 0) return null;

  if (Array.isArray(errors.issues)) {
    return errors.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }
  return JSON.stringify(errors);
};

module.exports = { formatValidateErrors };
