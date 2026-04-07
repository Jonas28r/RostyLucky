const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    await client.connect();
    const db = client.db('rostylucky_db');
    const users = db.collection('users');
    const { id, referrer } = req.query;

    if (req.method === 'GET') {
        let user = await users.findOne({ telegramId: id });
        if (!user) {
            user = { 
                telegramId: id, 
                points: 0, 
                level: 1, 
                energy: 0, 
                balance: 0,
                referredBy: referrer || null, // Guarda quién lo invitó
                lastAction: Date.now() 
            };
            await users.insertOne(user);
        }
        return res.status(200).json(user);
    }

    if (req.method === 'POST') {
        const { type, amount } = req.body;
        const user = await users.findOne({ telegramId: id });

        // --- CAPA 1: ANTI-BOT DE TIEMPO ---
        const now = Date.now();
        const diff = now - user.lastAction;
        if (diff < 500 && type === 'tap') { // Si hace taps en menos de 0.5 seg constantes
            return res.status(403).json({ error: "Actividad sospechosa detectada" });
        }

        // --- CAPA 2: SISTEMA DE REFERIDOS (10%) ---
        if (user.referredBy && amount > 0) {
            const commission = amount * 0.10;
            await users.updateOne(
                { telegramId: user.referredBy },
                { $inc: { balance: commission } }
            );
        }

        // Actualizar datos del usuario
        await users.updateOne(
            { telegramId: id },
            { $inc: { [type]: amount }, $set: { lastAction: now } }
        );
        
        return res.status(200).json({ success: true });
    }
}
