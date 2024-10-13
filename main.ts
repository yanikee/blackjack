var money = 5;

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function how_much_bet() {
  readline.question('いくら賭けますか？ ', (answer) => {
    console.log(`入力値: $${answer}`);
    readline.close();
  });
}

function start() {
  console.log(`あなたの所持金は$${money}です。`)
  const answer = how_much_bet();
  console.log(answer);
}

start()