const mysql = require('mysql2/promise');
async function run() {
  const pool = mysql.createPool({host:'localhost',user:'root',password:'',database:'swiftmatch',waitForConnections:true});
  const [r] = await pool.query('SELECT id, display_name, name FROM user_profiles WHERE id IN (2,3)');
  r.forEach(u => {
    console.log('id:', u.id);
    console.log('  display_name hex:', Buffer.from(u.display_name).toString('hex'));
    console.log('  display_name:', u.display_name);
    console.log('  name hex:', Buffer.from(u.name).toString('hex'));
    console.log('  name:', u.name);
  });
  const [m] = await pool.query('SELECT id, text FROM messages LIMIT 3');
  m.forEach(msg => {
    console.log('msg', msg.id, 'hex:', Buffer.from(msg.text).toString('hex'));
    console.log('msg', msg.id, 'text:', msg.text);
  });
  await pool.end();
}
run();
