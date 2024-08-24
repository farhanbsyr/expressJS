export const creatUserValidationSchemas = {
  userName: {
    isLength: {
      options: {
        min: 5,
        max: 35,
      },
      errorMessage: "username must be at 5-35 charachter",
    },
    notEmpty: {
      errorMessage: "username cannot be empty",
    },
  },
  displayName: {
    isLength: {
      options: {
        min: 5,
        max: 35,
      },
      errorMessage: "displayName must be at 5-35 charachter",
    },
    notEmpty: {
      errorMessage: "displayName cannot be empty",
    },
  },
};
