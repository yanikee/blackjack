const data = {
  money: 5,
  bet: 0,
  dealer: [[], []], //[1,2,3,...,13], [A,2,3,...,K]]
  player: [[], []], //[1,2,3,...,13], [A,2,3,...,K]]
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
      const num = Math.floor(Math.random() * 13) + 1;
      let card = num
      if (num == 1) {
        card = "A"
      } else if (num == 10) {
        card = "J"
      } else if (num == 11) {
        card = "Q"
      } else if (num == 12) {
        card = "k"
      } else {
        card = num
      }
      data[participant][0].push(num);
      data[participant][1].push(card);
    }
  });
}

async function startGame() {
  console.log(`あなたの所持金は$${data.money}です。`);
  data.bet = await askBet();
  data.money -= data.bet;
  console.log(`入力された賭け金: $${data.bet}`)
  readline.close();

  dealCards();

  console.log(`ディーラー\n　1枚目: ${data.dealer[1][0]}\n　2枚目: 秘密`);
  console.log(`プレイヤー\n　1枚目: ${data.player[1][0]}\n　2枚目: ${data.player[1][1]}`);
}

startGame()