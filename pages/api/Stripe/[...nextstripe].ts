import stripeConfig from "../../../config/stripe";
import NextStripe from "next-stripe";

export default NextStripe({
  stripe_key: stripeConfig.secretkey,
});
