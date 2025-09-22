import { useState } from "react";

export const useFormErrors = () => {
  const [error, setError] = useState({ hasError: false, messages: [] });

  const setErrors = (messagesArray) => {
    setError({ 
      hasError: true, 
      messages: Array.isArray(messagesArray) ? messagesArray : [messagesArray] 
    });
  };

  const clearErrors = () => setError({ hasError: false, messages: [] });

  return {
    error,
    setErrors,
    clearErrors,
  };
};
