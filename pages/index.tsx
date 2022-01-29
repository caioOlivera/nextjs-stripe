import { GetServerSideProps } from "next";
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "next-stripe/client";

import stripeConfig from "../config/stripe";

interface IPrice extends Stripe.Price {
  product: Stripe.Product;
}

interface IProps {
  prices: IPrice[];
}

export default function Home({ prices }: IProps) {
  const onClick = async (priceId: string) => {
    const session = await createCheckoutSession({
      success_url: window.location.href,
      cancel_url: window.location.href,
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_types: ["card"],
      mode: "payment",
    });
    const stripe = await loadStripe(stripeConfig.publickey);
    if (stripe) {
      stripe.redirectToCheckout({ sessionId: session.id });
    }
  };

  return (
    <>
      <div>
        <h1>Caio Stripe Store</h1>
        <ul>
          {prices.map((price) => (
            <li key={price.id}>
              <h1>{price.product.name}</h1>
              <img src={price.product.images[0]} style={{ width: "200px" }} />
              <h3>{price.product.description}</h3>
              <p>
                Cost: R${((price.unit_amount as number) / 100).toFixed(2)}{" "}
                {price.currency.toUpperCase()}
              </p>
              <button onClick={() => onClick(price.id)}>Buy</button>
              <br />
              <br />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const stripe = new Stripe(stripeConfig.secretkey, {
    apiVersion: `2020-08-27`,
  });

  const prices = await stripe.prices.list({
    active: true,
    limit: 10,
    expand: ["data.product"],
  });

  return { props: { prices: prices.data } };
};
