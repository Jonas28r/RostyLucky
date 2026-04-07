const { MongoClient, ObjectId } = require('mongodb');

// URL de conexión (la que copiaste de MongoDB Atlas)
const url = process.env.MONGODB_URI; 
const dbName = 'rostylucky';

async function connectToDatabase() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    return client.db(dbName);
}

module.exports = async (req, res) => {
    // Para validación de seguridad de Telegram
    const userId = req.query.id; 
    if (!userId) return res.status(400).json({ error: 'ID de usuario requerido' });

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    let user = await usersCollection.findOne({ telegramId: userId });

    if (!user) {
        // Registrar nuevo usuario
        user = {
            telegramId: userId,
            level: 1,
            points: 0,
            energy: 0,
            balanceUSDT: 0.00,
            lastMining: null,
            tapCount: 0
        };
        await usersCollection.insertOne(user);
    }

    if (req.method === 'POST') {
        // Guardar cambios (cuando el usuario cierra la app o gana algo)
        const updateData = req.body;
        await usersCollection.updateOne({ _auth: userId }, { $set: updateData });
        return res.json({ status: 'success' });
    }

    // Por defecto (GET), devuelve los datos del usuario
    res.json(user);
};
