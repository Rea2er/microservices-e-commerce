import Link from 'next/link';

const Order = ({ orders }) => {
  const orderList = orders.map((order) => {
    return (
      <tr key={order._id}>
        <td>{order.product.title}</td>
        <td>{order.status}</td>
        <td>
          {order.status == 'Created' && (
            <Link href="/order/[orderId]" as={`/order/${order._id}`}>
              <a>Make Payment</a>
            </Link>
          )}
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </table>
    </div>
  );
};

Order.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');
  return { orders: data };
};

export default Order;
