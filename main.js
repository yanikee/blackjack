const data = {
  money: 5,
  bet: 0,
  dealer: [],
  player: []
};

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});


function askBet() {
  return new Promise((resolve) => {
    readline.question('いくら賭けますか？ ', (bet) => {
      const betValue = parseInt(bet);
      // 入力された賭け金が、0以上所持金以下だった場合のみOK
      if (betValue > 0 && betValue <= data.money) {
        resolve(betValue);
      } else{
        console.log("適切な整数を入力してください")
        resolve(askBet());
      }
    });
  });
}

function dealCards() {
  ["dealer", "player"].forEach((participant) => {
    for (let i = 0; i < 2; i++) {
      data[participant].push(Math.floor(Math.random() * 13) + 1);
    }
  });
}

async function startGame() {
  console.log(`あなたの所持金は$${data.money}です。`);
  data.bet = await askBet();
  data.money -= data.bet;
  console.log(`入力された賭け金: $${data.bet}`)

  dealCards();

  console.log(data);
  readline.close();
}

startGame()