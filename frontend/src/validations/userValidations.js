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
    message: errors,
  };
};

const isEmpty = (value) => !value || value.trim() === "";

// Email validation
export const emailValidate = (email) => {
  const errors = [];
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (isEmpty(email)) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email)) {
    errors.push("Invalid email format, enter a valid email");
  }

  return {
    error: errors.length > 0,
    message: errors, // singular 'message'
  };
};

// Password validation
export const passwordValidate = (password) => {
  const errors = [];
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (isEmpty(password)) {
    errors.push("Password is required");
  } else if (!passwordRegex.test(password)) {
    errors.push(
      "Password must contain at least:",
      "- One lowercase letter",
      "- One uppercase letter",
      "- One digit",
      "- One special character (!@#$%^&*)",
      "- Minimum 8 characters"
    );
  }

  return {
    error: errors.length > 0,
    message: errors, // singular 'message'
  };
};

// Full name validation
export const nameValidate = (fullname) => {
  const errors = [];
  // Allow letters, spaces, underscore
  const nameRegex = /^[A-Za-z _]{3,}$/
;

  if (isEmpty(fullname)) {
    errors.push("Name is required");
  } else if (!nameRegex.test(fullname)) {
    errors.push(
      "Invalid name",
      "- Name can only contain letters, spaces, underscore"
    );
  }

  return {
    error: errors.length > 0,
    message: errors, // singular 'message'
  };
};

export const bioValidate = (bio) => {
  const errors = []
  const bioRegex = /^(?=.{1,})(?=.*[A-Za-z])([A-Za-z][A-Za-z0-9_-]*)(\s+[A-Za-z0-9_-]+){2,}$/

  if(isEmpty(bio)) {
    errors.push(
      "Bio is required"
    )
  }else if(!bioRegex.test(bio)) {
    errors.push(
      "Bio must contain at least 3 words",
      "Start with a letter", 
      "only include letters, numbers, underscores / hyphens"
    )
  }

  return {
    error: errors.length > 0,
    message: errors
  }
}