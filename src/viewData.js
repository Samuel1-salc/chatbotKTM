const mysql = require('mysql2');

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'chatbot'
});

db.connect(err => {
  if (err) {
    console.error('Could not connect to MySQL', err);
  } else {
    console.log('Connected to MySQL');
  }
});

async function viewData() {
  db.query('SELECT * FROM contact_states', (err, results) => {
    if (err) throw err;
    console.log(results);
    db.end();
  });
}

viewData();