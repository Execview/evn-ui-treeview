

const validateString = (text) => {
  if (text.replace(/\n/g, '').length > 5) {
    return true;
  }
  return false;
};

const validateNumberInput = (text) => {
  if (text > 25) {
    return true;
  }
  return false;
};

function validateInput(rule, text) {
  switch (rule) {
    case 0:
      return validateString(text);
    case 1:
      return validateNumberInput(text);
    default:
      return false;
  }
}

export { validateInput as default };
