// =============================================================
//  FIREBASE CONFIGURATION - Russian Market
//  باستخدام Firebase SDK v9 (Compatibility Mode)
//  مناسب للاستخدام مع script tags مباشرة في HTML
// =============================================================

// كود التهيئة الخاص بمشروعك (من Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyAVyUc3rGJ-zZcA5wXilxrpxiT6dmFGI0E",
    authDomain: "russian-market-786a4.firebaseapp.com",
    projectId: "russian-market-786a4",
    storageBucket: "russian-market-786a4.firebasestorage.app",
    messagingSenderId: "218382359254",
    appId: "1:218382359254:web:b71ee981b32f6e54948777",
    measurementId: "G-X9BMZZS228"
};

// تهيئة Firebase (في Compatibility Mode)
firebase.initializeApp(firebaseConfig);

// الحصول على مرجع لقاعدة البيانات (Firestore)
const db = firebase.firestore();

// =============================================================
//  أسماء المجموعات (Collections)
// =============================================================
const USERS_COLLECTION = 'users';
const CVV_COLLECTION = 'cvv';
const LOGS_COLLECTION = 'logs';
const NEWS_COLLECTION = 'news';
const DEPOSIT_ADDRESSES_COLLECTION = 'deposit_addresses';

// =============================================================
//  دوال مساعدة للتعامل مع Firestore
// =============================================================

async function getAllDocs(collectionName) {
    const snapshot = await db.collection(collectionName).get();
    const results = [];
    snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
    });
    return results;
}

async function addDoc(collectionName, data) {
    const docRef = await db.collection(collectionName).add(data);
    return { id: docRef.id, ...data };
}

async function updateDoc(collectionName, docId, data) {
    await db.collection(collectionName).doc(docId).update(data);
}

async function deleteDoc(collectionName, docId) {
    await db.collection(collectionName).doc(docId).delete();
}

async function getDocById(collectionName, docId) {
    const doc = await db.collection(collectionName).doc(docId).get();
    if (doc.exists) {
        return { id: doc.id, ...doc.data() };
    }
    return null;
}

// =============================================================
//  دوال خاصة بالمستخدمين
// =============================================================

async function getUsers() {
    return await getAllDocs(USERS_COLLECTION);
}

async function getUserByUsername(username) {
    const snapshot = await db.collection(USERS_COLLECTION)
        .where('username', '==', username)
        .get();
    let user = null;
    snapshot.forEach(doc => {
        user = { id: doc.id, ...doc.data() };
    });
    return user;
}

async function addUser(userData) {
    const existing = await getUserByUsername(userData.username);
    if (existing) {
        throw new Error('Username already exists');
    }
    const docRef = await db.collection(USERS_COLLECTION).add(userData);
    return { id: docRef.id, ...userData };
}

async function updateUser(userId, updates) {
    await db.collection(USERS_COLLECTION).doc(userId).update(updates);
}

async function deleteUser(userId) {
    await db.collection(USERS_COLLECTION).doc(userId).delete();
}

// =============================================================
//  دوال خاصة بـ CVV
// =============================================================

async function getCvvData() {
    return await getAllDocs(CVV_COLLECTION);
}

async function addCvvItem(data) {
    return await addDoc(CVV_COLLECTION, data);
}

async function updateCvvItem(docId, data) {
    await updateDoc(CVV_COLLECTION, docId, data);
}

async function deleteCvvItem(docId) {
    await deleteDoc(CVV_COLLECTION, docId);
}

// =============================================================
//  دوال خاصة بـ LOGS
// =============================================================

async function getLogsData() {
    return await getAllDocs(LOGS_COLLECTION);
}

async function addLogItem(data) {
    return await addDoc(LOGS_COLLECTION, data);
}

async function updateLogItem(docId, data) {
    await updateDoc(LOGS_COLLECTION, docId, data);
}

async function deleteLogItem(docId) {
    await deleteDoc(LOGS_COLLECTION, docId);
}

// =============================================================
//  دوال خاصة بـ NEWS
// =============================================================

async function getNewsData() {
    const snapshot = await db.collection(NEWS_COLLECTION).limit(1).get();
    let news = null;
    snapshot.forEach(doc => {
        news = { id: doc.id, ...doc.data() };
    });
    return news;
}

async function saveNewsData(newsData) {
    const existing = await getNewsData();
    if (existing) {
        await db.collection(NEWS_COLLECTION).doc(existing.id).update(newsData);
    } else {
        await db.collection(NEWS_COLLECTION).add(newsData);
    }
}

// =============================================================
//  دوال خاصة بـ Deposit Addresses
// =============================================================

async function getDepositAddresses() {
    const snapshot = await db.collection(DEPOSIT_ADDRESSES_COLLECTION).limit(1).get();
    let data = null;
    snapshot.forEach(doc => {
        data = { id: doc.id, ...doc.data() };
    });
    return data;
}

async function saveDepositAddresses(addressesData) {
    const existing = await getDepositAddresses();
    if (existing) {
        await db.collection(DEPOSIT_ADDRESSES_COLLECTION).doc(existing.id).update(addressesData);
    } else {
        await db.collection(DEPOSIT_ADDRESSES_COLLECTION).add(addressesData);
    }
}

console.log('✅ Firebase initialized successfully!');
console.log('📂 Firestore collections ready:', {
    users: USERS_COLLECTION,
    cvv: CVV_COLLECTION,
    logs: LOGS_COLLECTION,
    news: NEWS_COLLECTION,
    deposit: DEPOSIT_ADDRESSES_COLLECTION
});