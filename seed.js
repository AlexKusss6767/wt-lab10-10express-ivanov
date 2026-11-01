const pool = require("./db");

async function addProduct() {
    try {
        const result = await pool.query(
            'INSERT INTO "Products" ("Name", "Category", "Price", "IsAvailable", "Description") VALUES ($1, $2, $3, $4, $5) RETURNING *',
            ["Ноутбук", "Компьютеры", 2500, true, "Мощный игровой ноутбук"]
        );
        console.log("✅ Товар добавлен:", result.rows[0]);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

addProduct();