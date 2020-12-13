import useRequest from '../../hooks/userequest';
import Router from 'next/router';

const Product = ({ good }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      productId: good._id,
    },
    onSuccess: (order) =>
      Router.push('/order/[orderId]', `/order/${order._id}`),
  });

  return (
    <div>
      <h1>{good.title}</h1>
      <h4>Price: {good.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

Product.getInitialProps = async (context, client) => {
  const { productId } = context.query;
  const { data } = await client.get(`/api/goods/${productId}`);
  return { good: data };
};

export default Product;
