import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/userequest';
import Router from 'next/router';

const Order = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payment',
    method: 'post',
    body: {
      orderId: order._id,
    },
    onSuccess: () => Router.push('/order'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timeId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timeId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => {
          doRequest({ token: id });
        }}
        stripeKey="pk_test_51HpGV7Kgfor5Q4eOBoUHRnEAfaOjGE9lkAJcsYXvWhY16xT6ZQ3QX0wvE2IBA4iW8iyQBVDrNvKkHdaUmJ70g52z00sXKqi5c6"
        amount={order.product.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

Order.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default Order;
