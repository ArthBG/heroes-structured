const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3333;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'villainsbt',
    password: 'ds564',
    port: 5432,
});

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Villains API' });
});

app.get('/villains', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM villains');
        res.status(200).json({
            total: result.rowCount,
            villains: result.rows,
        });
    } catch (error) {
        console.error("Cannot get villains", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/villains/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM villains WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Villain not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error("Cannot get this villain", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/villains/name/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const result = await pool.query('SELECT * FROM villains WHERE name = $1', [name]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Villain not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error("Cannot get this villain", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/villains', async (req, res) => {
        let { name, power, damage, level, hp } = req.body;
        name = name.toLowerCase();
        power = power.toLowerCase();
        const query = 'INSERT INTO villains (name, power, damage, level, hp) VALUES ($1, $2, $3, $4, $5)';
        const values = [name, power, damage, level, hp];
        try {
        if (!name || !power || !damage || !level || !hp) {
            res.status(400).json({ error: 'Please provide all the fields' });
        } 
        if (damage < 0 || level < 0 || hp < 0) {
            res.status(400).json({ error: 'Please provide positive values for damage, level and hp' });
        }
        if (typeof name !== 'string' || typeof power !== 'string') {
            res.status(400).json({ error: 'Please provide a string for name and power' });
        }
        if (typeof damage !== 'number' || typeof level !== 'number' || typeof hp !== 'number') {
            res.status(400).json({ error: 'Please provide a number for damage, level and hp' });
        } 
        if (await pool.query('SELECT * FROM villains WHERE name = $1', [name]).rowCount > 0) {
            res.status(400).json({ error: 'This villain already exists' });
        }
        else {
        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Villain created successfully', villain: result.rows[0] });
        }
        
    } catch (error) {
        console.error("Cannot create this villain", error);
        res.status(500).json({ error: error.message });
    }
}
);

app.put('/villains/:id', async (req, res) => {
    const { id } = req.params;
    let { name, power, damage, level, hp } = req.body;
    name = name.toLowerCase();
    power = power.toLowerCase();
    const query = 'UPDATE villains SET name = $1, power = $2, damage = $3, level = $4, hp = $5 WHERE id = $6';
    const values = [name, power, damage, level, hp, id];

    try {
        if (!name || !power || !damage || !level || !hp) {
            res.status(400).json({ error: 'Please provide all the fields' });
        } 
        if (damage < 0 || level < 0 || hp < 0) {
            res.status(400).json({ error: 'Please provide positive values for damage, level and hp' });
        }
        if (typeof name !== 'string' || typeof power !== 'string') {
            res.status(400).json({ error: 'Please provide a string for name and power' });
        }
        if (typeof damage !== 'number' || typeof level !== 'number' || typeof hp !== 'number') {
            res.status(400).json({ error: 'Please provide a number for damage, level and hp' });
        } else {
            const result = await pool.query(query, values);
            res.status(200).json({ message: 'Villain updated successfully', villain: result.rows[0] });
        }
    } catch (error) {
        console.error("Cannot update this villain", error);
        res.status(500).json({ error: error.message });
    }
}
);

app.delete('/villains/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM villains WHERE id = $1';
    const values = [id];
    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Villain not found' });
        } else {
            res.status(200).json({ message: 'Villain deleted successfully', villain: result.rows[0] });
        }
    } catch (error) {
        console.error("Cannot delete this villain", error);
        res.status(500).json({ error: error.message });
    }
}
);



const nameOfVillain = async (id) => {
    const villain = await pool.query('SELECT * FROM villains WHERE id = $1', [id]);
    if (villain.rows.length === 0) {
        return null;
    }
    return villain.rows[0].name;
}



const battle = async (villain1_id, villain2_id) => {
    const villain1 = await pool.query('SELECT * FROM villains WHERE id = $1', [villain1_id]);
    const villain2 = await pool.query('SELECT * FROM villains WHERE id = $1', [villain2_id]);
    
    if (villain1.rows.length == 0 || villain2.rows.length == 0) {
        return null;
    }
   
    const level1 = villain1.rows[0].level;
    const level2 = villain2.rows[0].level;
    const damage1 = villain1.rows[0].damage;
    const damage2 = villain2.rows[0].damage;
    const hp1 = villain1.rows[0].hp;
    const hp2 = villain2.rows[0].hp;

    if (damage1 > damage2) {
        await pool.query('UPDATE villains SET level = $1 WHERE id = $2', [level1 + 1, villain1_id]);
        return villain1_id;
    } else if (damage2 > damage1) {
        await pool.query('UPDATE villains SET level = $1 WHERE id = $2', [level2 + 1, villain2_id]);
        return villain2_id;
    } else if (hp1 > hp2) {
        await pool.query('UPDATE villains SET level = $1 WHERE id = $2', [level1 + 1, villain1_id]);
        return villain1_id;
    } else if (hp2 > hp1) {
        await pool.query('UPDATE villains SET level = $1 WHERE id = $2', [level2 + 1, villain2_id]);
        return villain2_id;
    } else if (damage1 === damage2 && hp1 === hp2 && level1 > level2) {
        await pool.query('UPDATE villains SET level = $1 WHERE id = $2', [level1 + 1, villain1_id]);
        return villain1_id;
    } else if (damage1 === damage2 && hp1 === hp2 && level2 > level1) {
        await pool.query('UPDATE villains SET level = $1 WHERE id = $2', [level2 + 1, villain2_id]);
        return villain2_id;
    } else if (damage1 === damage2 && hp1 === hp2 && level1 === level2) {
        console.error("Draw!");
    } else if (villain1_id === villain2_id) {
        console.error("Cannot battle the same villain");
    } else {
        console.error("Cannot battle these villains");
    }

}

app.post('/battles', async (req, res) => {
    const { villain1_id, villain2_id } = req.body;
    const winner_id = await battle(villain1_id, villain2_id);
    const loser_id = winner_id === villain1_id ? villain2_id : villain1_id;
    const winner = await nameOfVillain(winner_id);
    const loser = await nameOfVillain(loser_id);
    const query = 'INSERT INTO battles (villain1_id, villain2_id, winner_id, loser_id) VALUES ($1, $2, $3, $4)';
    const values = [villain1_id, villain2_id, winner_id, loser_id];

        try {
            const result = await pool.query(query, values);
            res.status(201).json({ 
                message: 'Battle created successfully', 
                battle: result.rows[0],
                villainsInBattle: {
                    villain1: await nameOfVillain(villain1_id),
                    id1: villain1_id,
                    villain2: await nameOfVillain(villain2_id),
                    id2: villain2_id,
                },
                winner: {
                    villain: winner,
                    id: winner_id,
                },
                loser: {
                    villain: loser,
                    id: loser_id,
                },
            });
        } catch (error) {
            console.error("Cannot create this battle", error);
            res.status(500).json({ error: error.message });
        }
});


app.get('/battles', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT battles.id, battles.villain1_id, battles.villain2_id, battles.winner_id, battles.loser_id, villains.name AS winner, villains2.name AS loser,villains.level AS winner_level, villains2.level AS loser_level, villains.damage AS winner_damage, villains2.damage AS loser_damage, villains.hp AS winner_hp, villains2.hp AS loser_hp FROM battles INNER JOIN villains ON battles.winner_id = villains.id INNER JOIN villains AS villains2 ON battles.loser_id = villains2.id`
        );
        res.status(200).json({
            total: result.rowCount,
            battles: result.rows,
        });
    } catch (error) {
        console.error("Cannot get battles", error);
        res.status(500).json({ error: error.message });
    }
}
);

app.delete('/battles/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM battles WHERE id = $1';
    const values = [id];
    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Battle not found' });
        } else {
            res.status(200).json({ message: 'Battle deleted successfully', battle: result.rows[0] });
        }
    } catch (error) {
        console.error("Cannot delete this battle", error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`👻 Server is running on http://localhost:${port}`);
});