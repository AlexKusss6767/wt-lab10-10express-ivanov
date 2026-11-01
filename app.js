const express = require("express");
const pool = require("./db");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => res.send("Express работает!"));

app.get("/api/info", (req, res) => {
    res.json({ application: "Web Technologies", technology: "Node.js + Express", database: "PostgreSQL" });
});

app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS current_time");
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Ошибка подключения" });
    }
});

app.get("/api/products", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Products" ORDER BY "Id"');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Ошибка получения товаров" });
    }
});

app.get("/api/products/search", async (req, res) => {
    try {
        const name = req.query.name || "";
        const result = await pool.query('SELECT * FROM "Products" WHERE "Name" ILIKE $1 ORDER BY "Id"', [`%${name}%`]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Ошибка поиска" });
    }
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await pool.query('SELECT * FROM "Products" WHERE "Id" = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Товар не найден" });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Ошибка" });
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const { name, category, price, isAvailable, description } = req.body;
        if (!name || !category || price === undefined) return res.status(400).json({ error: "Некорректные данные" });
        const result = await pool.query(
            'INSERT INTO "Products" ("Name", "Category", "Price", "IsAvailable", "Description") VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, category, price, isAvailable, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Ошибка создания" });
    }
});

app.put("/api/products/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, category, price, isAvailable, description } = req.body;
        const result = await pool.query(
            'UPDATE "Products" SET "Name" = $1, "Category" = $2, "Price" = $3, "IsAvailable" = $4, "Description" = $5 WHERE "Id" = $6 RETURNING *',
            [name, category, price, isAvailable, description, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Товар не найден" });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Ошибка изменения" });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await pool.query('DELETE FROM "Products" WHERE "Id" = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Товар не найден" });
        res.json({ message: "Товар удалён", product: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Ошибка удаления" });
    }
});

app.use((req, res) => res.status(404).json({ error: "Маршрут не найден" }));

app.listen(port, "0.0.0.0", () => console.log(`Server started on port ${port}`));