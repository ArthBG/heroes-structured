require('dotenv').config()
const express = require('express');
const villainsRoutes = require('./routes/villainsRoutes');
const battlesRoutes = require('./routes/battlesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', villainsRoutes);
app.use('/', battlesRoutes);

app.listen(PORT, () => {
    console.log(`☠ Server running on port http://localhost:${PORT}`);
});