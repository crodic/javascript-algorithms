import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

// This value is from the props in the UI
const style = { layout: 'vertical' };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ showSpinner, currency, amount }) => {
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: 'resetOption',
            value: {
                ...options,
                currency: currency,
            },
        });
    }, [currency, showSpinner]);
    return (
        <>
            {showSpinner && isPending && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: { currency_code: currency, value: amount },
                                },
                            ],
                        })
                        .then((orderID) => console.log(orderId));
                }}
                onApprove={async (data, actions) => {
                    const order = await actions.order.capture();
                    if (order.status === 'COMPOLETED') {
                        console.log(order);
                    }
                }}
            />
        </>
    );
};

export default function App() {
    return (
        <div style={{ maxWidth: '750px', minHeight: '200px' }}>
            <PayPalScriptProvider options={{ clientId: 'test', components: 'buttons', currency: 'USD' }}>
                <ButtonWrapper showSpinner={false} currency="USD" amount={2000} />
            </PayPalScriptProvider>
        </div>
    );
}
