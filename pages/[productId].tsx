import React from "react";
import Stripe from "stripe";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";

import stripeConfig from "../config/stripe";

interface Props {
  product: Stripe.Sku;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const stripe = new Stripe(stripeConfig.secretkey, {
    apiVersion: `2020-08-27`,
  });

  const products = await stripe.products.list();

  const paths = products.data.map((product) => ({
    params: {
      productId: product.id,
    },
  }));

  console.log(paths);

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const stripe = new Stripe(stripeConfig.secretkey, {
    apiVersion: `2020-08-27`,
  });

  const { productId } = params;

  const product = await stripe.products.retrieve(productId as string);

  console.log(product);

  return {
    props: {
      product,
    },
  };
};

const Product: React.FC<Props> = ({ product }) => {
  return (
    <div>
      <h1>{product.name}</h1>
      {product.images && (
        <img
          alt="imagem"
          src={product.images}
          style={{
            width: "100px",
          }}
        />
      )}
      <h2>{Number(product.price / 100).toFixed(2)} </h2>
      ;
      <br />
      <br />
      <Link href="/">Go back</Link>
    </div>
  );
};

export default Product;
