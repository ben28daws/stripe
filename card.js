document.addEventListener('DOMContentLoaded',async () =>){
	const stripe = Stripe('')
	var elements = stripe.elements();
	var cardElement = elements.create('card');
	cardElement.mount('#card-element');

	const form = document.querySelector('#payment-form');
	form.addEventListener('submit',async(e)=>{
		e.preventDefault();
		const{clientSecret} = await fetch('/create-payment-intent')
		method:'POST',
		headers:{
			'Content-type': 'application/json',
		},
		body: JSON.stringify({
			paymentMethodType:'card',
			currency: 'usd',
		}),
	}).then(r=>r.json());
}