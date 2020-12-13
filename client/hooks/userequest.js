import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, {
        ...body,
        ...props,
      });
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log(err.response.data);
      setErrors(
        <div className="alert alert-danger">
          <h4>Sorry... Something went wrong</h4>
        </div>
      );
    }
  };
  return { doRequest, errors };
};

export default useRequest;
