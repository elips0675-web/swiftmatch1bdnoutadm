const mysql = require('mysql2/promise');
async function run() {
  const pool = mysql.createPool({host:'localhost',user:'root',password:'',database:'swiftmatch',waitForConnections:true});
  const [r] = await pool.query("SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'swiftmatch'");
  console.log('DB charset:', JSON.stringify(r));
  const [r2] = await pool.query("SHOW VARIABLES LIKE 'character_set%'");
  r2.forEach(v => console.log(v.Variable_name + ': ' + v.Value));
  await pool.end();
}
run();
