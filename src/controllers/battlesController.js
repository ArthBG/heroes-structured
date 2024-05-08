const pool = require('../config/dbConfig');
const battle = require('../models/battle.js');
const nameOfVillain = require('../models/villains.js');


async function BattleWinner (req, res) {
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
};


async function getBattles (req, res) {
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
};

 async function getBattlesByVillainName(req, res) {
    try {
        const { name } = req.params;
        const result = await pool.query(
            `SELECT battles.id, battles.villain1_id, battles.villain2_id, battles.winner_id, battles.loser_id, villains.name AS winner, villains2.name AS loser,villains.level AS winner_level, villains2.level AS loser_level, villains.damage AS winner_damage, villains2.damage AS loser_damage, villains.hp AS winner_hp, villains2.hp AS loser_hp FROM battles INNER JOIN villains ON battles.winner_id = villains.id INNER JOIN villains AS villains2 ON battles.loser_id = villains2.id WHERE villains.name = $1 OR villains2.name = $1`, [name]
        );
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Battle not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error("Cannot get this battle", error);
        res.status(500).json({ error: error.message });
    }
};

async function deleteBattle (req, res) {
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
};

module.exports = { BattleWinner, getBattles, getBattlesByVillainName, deleteBattle };