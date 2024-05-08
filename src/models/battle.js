
async function Battle (villain1_id, villain2_id) {
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

};

module.exports = Battle;
