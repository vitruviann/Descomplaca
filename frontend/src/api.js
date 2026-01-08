
import { db, functions } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

// --- Orders ---

export const createOrder = async (orderData) => {
    try {
        const docRef = await addDoc(collection(db, "orders"), {
            ...orderData,
            status: "OPEN",
            created_at: serverTimestamp()
        });
        return { id: docRef.id, ...orderData, status: "OPEN" };
    } catch (e) {
        console.error("Error creating order: ", e);
        throw e;
    }
};

export const listOrders = async (city, state) => {
    // Basic filtering if needed, currently list all for dispatcher
    // In production, use querying: query(collection(db, "orders"), where("status", "==", "OPEN"))
    const q = query(collection(db, "orders"), where("status", "==", "OPEN"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getOrder = async (orderId) => {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        // Convert timestamp to date usually happened in component or here
        // Firebase timestamps are objects {seconds, nanoseconds}
        return { id: docSnap.id, ...data, created_at: data.created_at?.toDate() };
    } else {
        throw new Error("Order not found");
    }
};

// --- Proposals ---

export const createProposal = async (proposalData) => {
    // proposalData: { order_id, fee_value, ... }
    const docRef = await addDoc(collection(db, "proposals"), {
        ...proposalData,
        created_at: serverTimestamp(),
        is_accepted: false
    });

    // Update order status if needed (client-side logic or use Cloud Function trigger)
    const orderRef = doc(db, "orders", proposalData.order_id);
    await updateDoc(orderRef, { status: "PROPOSAL_RECEIVED" });

    return { id: docRef.id, ...proposalData };
};

export const listProposals = async (orderId) => {
    const q = query(collection(db, "proposals"), where("order_id", "==", orderId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Payments (Cloud Functions) ---

export const checkoutProposal = async (proposalId) => {
    // Use Cloud Function for secure API calls to Asaas
    const createPayment = httpsCallable(functions, 'createAsaasPayment');
    const result = await createPayment({ proposalId });
    return result.data; // Expecting { payment_url: "..." }
};

// --- Secure Chat (Realtime) ---

// Replacing polling with Firestore listener
export const subscribeToMessages = (orderId, callback) => {
    const q = query(
        collection(db, "messages"),
        where("order_id", "==", orderId),
        orderBy("timestamp", "asc")
    );

    // returns unsubscribe function
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
        }));
        callback(messages);
    });
};

export const sendMessage = async (messageData) => {
    await addDoc(collection(db, "messages"), {
        ...messageData,
        timestamp: serverTimestamp()
    });
};

// --- Reviews ---

export const createReview = async (reviewData) => {
    await addDoc(collection(db, "reviews"), {
        ...reviewData,
        created_at: serverTimestamp()
    });
};
