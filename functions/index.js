
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

// Asaas Config via Firebase Environment Configuration
// Set via CLI: firebase functions:config:set asaas.key="YOUR_API_KEY"
const ASAAS_API_URL = "https://sandbox.asaas.com/api/v3";
const ASAAS_API_KEY = functions.config().asaas ? functions.config().asaas.key : process.env.ASAAS_API_KEY;

exports.createAsaasPayment = functions.https.onCall(async (data, context) => {
    // 1. Auth Check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }

    const { proposalId
    } = data;
    if (!proposalId) {
        throw new functions.https.HttpsError('invalid-argument', 'Proposal ID required');
    }

    try {
        // 2. Fetch Proposal
        const proposalSnap = await db.collection('proposals').doc(proposalId).get();
        if (!proposalSnap.exists) {
            throw new functions.https.HttpsError('not-found', 'Proposal not found');
        }
        const proposal = proposalSnap.data();

        // 3. Create Payment in Asaas
        // Note: Real implementation needs Customer creation first or retrieval
        // simplifying for MVP: creating a "one-off" payment or simple link
        // Creating a new customer strictly for this payment (simplified)
        const customerResponse = await axios.post(`${ASAAS_API_URL
            }/customers`,
            {
                name: "Cliente Descomplaca",
                cpfCnpj: "00000000000" // Mock or get from user profile
            },
            {
                headers: {
                    access_token: ASAAS_API_KEY
                }
            });

        const customerId = customerResponse.data.id;

        const paymentResponse = await axios.post(`${ASAAS_API_URL
            }/payments`,
            {
                customer: customerId,
                billingType: "PIX",
                value: proposal.total_value,
                dueDate: new Date().toISOString().split('T')[
                    0
                ], // Today
                description: `Pagamento Proposta ${proposalId
                    }`
            },
            {
                headers: {
                    access_token: ASAAS_API_KEY
                }
            });

        return {
            payment_url: paymentResponse.data.invoiceUrl
        };
    } catch (error) {
        console.error("Asaas Error", error.response?.data || error);
        throw new functions.https.HttpsError('internal', 'Payment creation failed');
    }
});

exports.validateProposal = functions.firestore.document('proposals/{propId
}').onCreate(async (snap, context) => {
    const newValue = snap.data();
const description = newValue.description || "";

// Anti-Leakage Regex
const phonePattern = /(\(?\d{
2
    }\)?\s ?\d{
    4,
        5
} -?\d{
    4
})/;
const emailPattern = /([a-zA-Z0-9._%+-
    ]+@[a - zA - Z0 - 9. -
    ] +\.[a - zA - Z
]{
    2,
    })/;

if (phonePattern.test(description) || emailPattern.test(description)) {
    // Flag as blocked
    await snap.ref.update({
        status: "BLOCKED",
        description: "[CONTEÚDO REMOVIDO POR SEGURANÇA]"
    });
    console.log(`Proposal ${context.params.propId
        } blocked due to leakage.`);
}
});
