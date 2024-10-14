const data = {
  money: 5,
  bet: 0
};

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});


function start() {
  console.log(`あなたの所持金は$${data.money}です。`)

  function askBet() {
    readline.question('いくら賭けますか？ ', (bet) => {
      data.bet = parseInt(bet)
      console.log(`入力値: $${bet}`);
      // 入力された賭け金が、0以上所持金以下だった場合のみOK
      if (0 < bet && bet <= data.money) {
        readline.close();
      } else{
        console.log("適切な整数を入力してください")
        askBet()
      }
    });
  }
  askBet()
}


start()