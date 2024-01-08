const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51OOfFqSAjgE0UNkOMiRxoqDyTwxvqMsZljAuEfDjn0q82ctSaxVACShUURsSQ7ySToE50augoyL2kgU835foXJdD00klvdo82z');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public:index.html');
});

app.post('/process-payment', async (req, res) => {
  try {
    const { token, billing_details } = req.body; 
    const amount = 1000; 

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'inr',
      payment_method_data: {
        type: 'card',
        card: {
          token: token,
        },
      },
      confirmation_method: 'manual',
      description: 'Sample Payment',
      billing_details: billing_details,
    });

   
    res.status(200).json({ success: true, message: 'Payment succeeded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Payment failed' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
