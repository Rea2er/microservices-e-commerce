import { useEffect } from 'react';
import useRequest from '../../hooks/userequest';
import Router from 'next/router';

const signout = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'get',
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>You are sign out</div>;
};

export default signout;
