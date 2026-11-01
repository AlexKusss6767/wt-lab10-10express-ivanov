const pool = require("./db");

async function createTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS "Products" (
                "Id" SERIAL PRIMARY KEY,
                "Name" VARCHAR(100) NOT NULL,
                "Category" VARCHAR(50),
                "Price" DECIMAL(10,2),
                "IsAvailable" BOOLEAN,
                "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "Description" TEXT
            );
        `);
        console.log("✅ Таблица Products успешно создана (или уже существовала)!");
    } catch (err) {
        console.error("❌ Ошибка создания таблицы:", err);
    } finally {
        pool.end(); 
    }
}

createTable();