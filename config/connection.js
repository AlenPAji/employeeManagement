const mongoose = require('mongoose');

module.exports.connect = function () {
    // Replace <password> with your actual MongoDB Atlas password
    const atlasUrl = "mongodb+srv://alenpaji:rrvDrbwgocPECh55@cluster0.qusfk9u.mongodb.net/?retryWrites=true&w=majority";

    mongoose.connect(atlasUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on('error', (err) => {
        console.error('Database connection error:', err);
    });

    db.once('open', () => {
        console.log('Database connected');
    });
};
