import Link from 'next/link';

const LandingPage = ({ currentUser, goods }) => {
  const productList = goods.map((product) => {
    return (
      <tr key={product._id}>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>
          <Link href="/product/[productId]" as={`/product/${product._id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Products</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{productList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/goods');
  return { goods: data };
};

export default LandingPage;
