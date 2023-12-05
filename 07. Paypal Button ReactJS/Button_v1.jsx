import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const Checkout = () => {
    return (
        <PayPalScriptProvider
            options={{
                clientId: 'AcnAPG7-jmuguideH3pKBxV16rJdvO3juNWxs-9VT6HiIrqFEca4rq2UDCfWhO6NEFF1AVAQGi0a13tU',
            }}
        >
            <PayPalButtons
                style={{ shape: 'pill' }}
                createOrder={(data, action) => {
                    return action.order.create({
                        application_context: {
                            shipping_preference: 'SET_PROVIDED_ADDRESS',
                        },
                        purchase_units: [
                            {
                                description: 'Game Sword Art Online',
                                amount: {
                                    value: 9,
                                },
                                shipping: {
                                    name: {
                                        full_name: 'Crodic Crystal',
                                    },
                                    address: {
                                        address_line_1: 'KP1/125B',
                                        address_line_2: 'Gò Dầu',
                                        admin_area_1: 'Tây Ninh',
                                        admin_area_2: 'VN',
                                        postal_code: '85001',
                                        country_code: 'US',
                                    },
                                },
                            },
                        ],
                    });
                }}
                onApprove={async (data, action) => {
                    const order = await action.order.capture;
                    // console.log(order)
                    console.log(data);
                    console.log(action);
                }}
            />
        </PayPalScriptProvider>
    );
};

export default Checkout;
