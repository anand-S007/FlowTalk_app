export const validateOnboard = (params) => {
  const { fullname, bio, nativeLanguage, learningLanguage, location } = params;

  const errors = [];

  // Helper: check empty fields
  const isEmpty = (value) => !value || value.trim() === "";

  if (isEmpty(fullname)) {
    errors.push("Full name is required.");
  }

  if (isEmpty(bio)) {
    errors.push("Bio is required.");
  } else if (bio.trim().split(/\s+/).length < 3) {
    errors.push("Bio must contain at least 3 words.");
  }

  if (isEmpty(location)) {
    errors.push("Location is required.");
  }

  if (isEmpty(nativeLanguage)) {
    errors.push("Native language is required.");
  }

  if (isEmpty(learningLanguage)) {
    errors.push("Learning language is required.");
  }

  return {
    error: errors.length > 0,
    messages: errors,
  };
};
