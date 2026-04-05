# <img width="40" height="40" alt="bookNOTES" src="https://github.com/user-attachments/assets/9eb7f533-3514-47b4-b329-f9c69ac1df58"/> BookNOTES

A full-stack personal reading journal where you can log books you've read, write notes, rate them, and view their covers — all stored in a PostgreSQL database with cover art pulled live from the Open Library API.

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Crystal%20Ball.png" alt="Crystal Ball" width="35" height="35" /> Features

- Add, edit, and delete book entries
- Auto-fetch book cover art from the Open Library API
- Built-in cover search tool — type a title to auto-fill cover ID, title, and author
- Rate books out of 10 with a visual star display
- Sort your shelf by most recent, top rated, or title A–Z
- Data persisted in a PostgreSQL database

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Hammer%20and%20Wrench.png" alt="Hammer and Wrench" width="35" height="35" /> Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Server     | Node.js + Express.js        |
| Database   | PostgreSQL + pg             |
| API Calls  | Axios                       |
| Templating | EJS                         |
| Styling    | CSS                         |

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bow%20and%20Arrow.png" alt="Bow and Arrow" width="35" height="35" /> Getting Started

### Option 1 — Clone from GitHub

**1. Clone the repository**
```bash
git clone https://github.com/your-username/BookNOTES.git
cd BookNOTES
```

**2. Install dependencies**
```bash
npm i
```

**3. Set up the database**

Open `psql` and run:
```sql
CREATE DATABASE "bookN";
\c bookN

CREATE TABLE books (
  id        SERIAL PRIMARY KEY,
  title     TEXT NOT NULL,
  author    TEXT,
  rating    INT,
  notes     TEXT,
  date_read DATE,
  cover_id  TEXT
);
```

**4. Configure your database credentials**

Open `index.js` and update the `pg.Client` config:
```javascript
const db = new pg.Client({
  user:     "postgres",      // your PostgreSQL username
  host:     "localhost",
  database: "bookN",
  password: "yourpassword",  // your PostgreSQL password
  port:     5432,
});
```

**5. Start the server**
```bash
nodemon index.js
```

Then open your browser and go to → [http://localhost:3000](http://localhost:3000)

---

### Option 2 — Run Locally (already downloaded)

**1. Install dependencies**
```bash
npm i
```

**2. Make sure PostgreSQL is running** and your `bookN` database exists with the `books` table (see SQL above).

**3. Start the server**
```bash
nodemon index.js
```

Then open → [http://localhost:3000](http://localhost:3000)

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Chains.png" alt="Chains" width="35" height="35" /> Project Structure

```
BookNOTES/
├── index.js              ← Express server, all routes
├── package.json
├── views/
│   ├── index.ejs         ← Main book listing page
│   └── form.ejs          ← Add & edit book form
└── public/
    ├── assets/
    │   └── bookNOTES.png ← App logo
    └── styles/
        └── main.css      ← All styles
```

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books.png" alt="Books" width="35" height="35" /> How Book Covers Work

Cover art is fetched from the [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers).

You store a `cover_id` (a number) in the database, and the app builds the image URL automatically:
```
https://covers.openlibrary.org/b/id/{cover_id}-M.jpg
```

**To find a cover ID:**
- Use the built-in search tool on the Add/Edit form — type a book title and click Search
- Or go to [openlibrary.org](https://openlibrary.org), find your book, and look for the `cover_i` field

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bookmark%20Tabs.png" alt="Bookmark Tabs" width="35" height="35" /> Available Scripts

| Command | Description |
|---|---|
| `npm i` | Install all dependencies |
| `nodemon index.js` | Start the server with auto-restart on file changes |
| `node index.js` | Start the server normally |

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" alt="Gear" width="35" height="35" /> Requirements

- Node.js v18+
- PostgreSQL v14+
- nodemon (installed globally or as a dev dependency)

Install nodemon globally if you don't have it:
```bash
npm install -g nodemon
```


# SNEAK PEAK <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Eyes.png" alt="Eyes" width="40" height="40" />

<img width="1160" height="904" alt="image" src="https://github.com/user-attachments/assets/189d2ad8-9e0a-4911-91cd-8361c98d4a52" />
<img width="707" height="899" alt="image" src="https://github.com/user-attachments/assets/8ad7f4cb-d302-4aab-9ceb-54ead5427c0c" />
<img width="675" height="904" alt="image" src="https://github.com/user-attachments/assets/c02e3a67-642c-4158-a4c8-67c64722763c" />


