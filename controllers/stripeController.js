const stripe = require("stripe")(process.env.STRIPE_KEY);

  //server only responsible for middle step that communcates with its own backend to make sure the item prices are correct, as frontend can manipulate
  //the values. then, you calculate the total amount. when you have the amount, you .create and pass in amount and currency. then wait
  //for response, and send back clientSecret to the client. Then you are able to complete payment on frontend.
  

const stripeController = async (req, res) => {
  //req.body has object with purchase, total, shipping. essentially need to get this info from the frontend
  //when working with stripe, need to provide smallest amount of currency - so 20$ = 2000 cents

  //need to verify the cost of the item is what the frontend is saying 2) need to communicate with stripe and get client secret
  const { purchase, total_amount, shipping_fee } = req.body;
  const calculateOrderAmount = () => {
    //normally would iterate over the list, take the ids, and then communicate with db and get back correct prices
    return total_amount + shipping_fee;
  };
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: "usd",
  });
  res.json({ clientSecret: paymentIntent.client_secret });

};

module.exports = stripeController;
