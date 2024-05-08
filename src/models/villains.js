const nameOfVillain = async (id) => {
    const villain = await pool.query('SELECT * FROM villains WHERE id = $1', [id]);
    if (villain.rows.length === 0) {
        return null;
    }
    return villain.rows[0].name;
}