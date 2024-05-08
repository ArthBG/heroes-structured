const express = require('express');


app.use(express.json());






app.listen(port, () => {
    console.log(`👻 Server is running on http://localhost:${port}`);
});