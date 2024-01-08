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
    const { paymentMethodId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      off_session: true,
      currency: 'USD',
      amount: 1000, 
      description: 'Sample Payment',
    });

    if (paymentIntent.status === 'requires_action') {
      res.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
        redirectUrl: paymentIntent.next_action.redirect_to_url.url,
      });
    } else if (paymentIntent.status === 'succeeded') {
      res.json({ success: true, message: 'Payment succeeded' });
    } else {
      res.json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Payment failed' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
