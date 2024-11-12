const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static('public')); // For serving static files

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pertemuanuts'
});

connection.connect((err) => {
    if (err) {
        console.error("terjadi kesalahan dalam koneksi ke database:", err.stack);
        return;
    }
    console.log("Koneksi mysql berhasil dengan id: " + connection.threadId);
});

app.set('view engine', 'ejs');

//ini adalah route untuk menampilkan data (create, read, update, delete)

//read
app.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
        res.render('index', { users: results});
    });
});

// Create
app.post('/add', (req, res) => {
    const { name, jenis, ukuran,} = req.body;
    const query = 'INSERT INTO users (name, jenis, ukuran) VALUES (?, ?, ?)';
    connection.query(query, [name, jenis, ukuran], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//update
//untuk akses halaman
app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if(err) throw err;
        res.render('edit', { user: result[0]});
    });   
});

//untuk proses update
app.post('/update/:id', (req, res) => {
    const { name, jenis, ukuran} = req.body;
    const query = 'UPDATE users SET name = ?, jenis = ?, ukuran = ? WHERE id = ?';
    connection.query(query, [name, jenis, ukuran, req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//hapus
app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if(err) throw err;
        res.redirect('/');
    });   
});

app.listen(3000,() => {
    console.log("server berjalan di port 3000, buka http://localhost:3000")
});
