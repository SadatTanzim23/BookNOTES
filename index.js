import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "bookN",
    password: "%NazmuS%2012",
    port: 5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const OL_COVER = "https://covers.openlibrary.org/b/id";
/*
Set up Express
Connect to PostgreSQL using pg
Use Axios to call Open Library API
Create routes:
GET / → show all books
POST /add → add book
POST /update/:id
POST /delete/:id
*/

app.get("/", async(req, res) => {
    const sortOptions = {
        rating: "rating DESC NULLS LAST", //10-1
        date: "date_read DESC NULLS LAST", //newest-oldest
        title: "title ASC", //a-z
    }
    const sort = sortOptions[req.query.sort] || sortOptions.date; //grabs the end of url like rating or what not, and if it doesnt work falls back to data
    try {
        const result = await db.query(`SELECT * FROM books ORDER BY ${sort}`);
        const books = result.rows.map((b) => ({ //loops over everytfield and adds an extrafield
            ...b, //keep all existing fields
            cover_url: b.cover_id ?
                `${OL_COVER}/${b.cover_id}-M.jpg` : //if cover_id exists, build the full image URL
                null,

        }));
        res.render("index", { books, currentSort: req.query.sort || "date" }); //array of books and currentSort → which sort is active so the correct pill gets highlighted
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).send("Database error - check console.")
    }
});

app.get("/add", (req, res) => {
    res.render("form", { book: null, error: null });
});

// GET /edit/:id — loads the edit form pre-filled with the book's existing data
app.get("/edit/:id", async(req, res) => {
    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0) return res.redirect("/");
        res.render("form", { book: result.rows[0], error: null });
    } catch (err) {
        console.error("Error fetching book for edit:", err);
        res.redirect("/");
    }
});

app.post("/add", async(req, res) => {
    const { title, author, rating, notes, date_read, cover_id } = req.body;
    if (!title.trim()) {
        return res.render("form", {
            book: req.body,
            error: "Title is required.",
        });
    }
    try {
        await db.query( //Send an INSERT query to PostgreSQL to create a new row in the books table
            `INSERT INTO books (title, author, rating, notes, date_read, cover_id)
             VALUES ($1, $2, $3, $4, $5, $6)`, [
                title.trim(),
                author.trim() || null,
                rating ? parseInt(rating) : null,
                notes.trim() || null,
                date_read || null,
                cover_id.trim() || null,
            ]
        );
        res.redirect("/");
    } catch (err) {
        console.error("Error inserting boook:", err);
        res.render("form", { book: req.body, error: "Failed to save. Try again." });
    }
});

app.post("/edit/:id", async(req, res) => {
    const { title, author, rating, notes, date_read, cover_id } = req.body;
    const id = req.params.id; //We need this to know WHICH book row to update in the database

    if (!title.trim()) { //We need id here so the form still knows which book it's editing
        return res.render("form", {
            book: {...req.body, id },
            error: "Title is required.",
        });
    }

    try {
        await db.query(
            `UPDATE books
       SET title=$1, author=$2, rating=$3, notes=$4, date_read=$5, cover_id=$6
       WHERE id=$7`, [
                title.trim(),
                author.trim() || null,
                rating ? parseInt(rating) : null,
                notes.trim() || null,
                date_read || null,
                cover_id.trim() || null,
                id,
            ]
        );
        res.redirect("/");
    } catch (err) {
        console.error("Error updating book:", err);
        res.render("form", { book: {...req.body, id }, error: "Update failed." });
    }
});

app.post("/delete/:id", async(req, res) => {
    try {
        await db.query("DELETE FROM books WHERE id = $1", [req.params.id]);
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting book:", err);
        res.redirect("/");
    }
});

app.get("/api/search-cover", async(req, res) => {
    const q = req.query.q; //whatever the user typed in the search box from url
    if (!q) return res.json({ cover_id: null }); //if serach was empty returns null

    try {
        const response = await axios.get("https://openlibrary.org/search.json", { //calls the library's search api
            params: { q, limit: 1, fields: "title,author_name,cover_i" }, //the search, only one result, only fetch these certain fields
        });

        const docs = response.data.docs; //the resuls from open library
        const book = docs && docs[0]; //docs acly exist and the best result

        res.json({ //sends back just the 3 things the form needs
            cover_id: (book && book.cover_i) || null,
            title: (book && book.title) || null,
            author: (book && book.author_name && book.author_name[0]) || null,
        });
    } catch (err) {
        console.error("Open Library search error:", err.message);
        res.json({ cover_id: null });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});