const { PassThrough } = require('stream');
const { resourceLimits } = require('worker_threads');

const data = {
  money: 5,
  bet: 0,
  dealer: [[], []], //[1,2,3,...,13], [A,2,3,...,K]]
  player: [[], []], //[1,2,3,...,13], [A,2,3,...,K]]
  dealer_total: 0,
  player_total: 0,
  dealer_loop: true,
  player_loop: true,
  dealer_result: null,
  player_result: null,
  result: null
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
  let num = Math.floor(Math.random() * 13) + 1;
  let card = 0
  if (num == 1) {
    card = "A";
  } else if (num == 11) {
    card = "J";
    num = 10
  } else if (num == 12) {
    card = "Q";
    num = 10;
  } else if (num == 13) {
    card = "K";
    num = 10;
  } else {
    card = num.toString();
  }
  return [num, card];
}

function one_or_eleven(n, user) {
  let res = 0
  if (data[user][1][n] == "A") {
    if (user == "dealer") {
      const x = Math.floor(Math.random() * 2) + 1;
      if (x == 1) {
        res = 1;
      } else {
        res = 11;
      }
      data[user][0][n] = res;
      if (n == 0) {
        console.log(`ディーラーの1枚目のAは"${res}"として扱います`)
      }
    } else {
      return new Promise((resolve) => {
        readline.question(`${n+1}枚目のカードがAでした。"1"か"11"のどちらにしますか？ `, (answer) => {
          const res = parseInt(answer);
          if (res == 1 || res == 11) {
            data[user][0][n] = res;
            resolve(res);
          } else{
            console.log('"1"か"11"を入力してください');
            resolve(one_or_eleven(n, "player"));
          }
        });
      });
    }
  }
}

function askDrawCard(user) {
  if (user == "dealer") {
    const total = data.dealer[0].reduce(function(sum, element) {
      return sum + element;
    }, 0);
    if (total < 15) {
      return true;
    } else if (total > 17) {
      return false;
    } else {
      const x = Math.floor(Math.random() * 2) + 1;
      if (x == 1) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return new Promise((resolve) => {
      readline.question("カードを引きますか？ (y/n): ", (answer) => {
        if (answer.toLowerCase() === "y") {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}

function result() {
  data.dealer_total = data.dealer[0].reduce(function(sum, element) {
    return sum + element;
  }, 0);
  data.player_total = data.player[0].reduce(function(sum, element) {
    return sum + element;
  }, 0);

  if (data.dealer_total > 21) {
    data.dealer_result = `${data.dealer_total}でバースト`;
    if (data.player_total > 21) {
      data.player_result = `${data.player_total}でバースト`;
      data.result = "引き分け"
    } else if (data.player_total == 21) {
      data.player_result = "ブラックジャック";
      data.result = "プレイヤーの勝ち";
    } else {
      data.player_result = `${data.player_total}`;
      data.result = "プレイヤーの勝ち";
    }
  } else if (data.dealer_total == 21) {
    data.dealer_result = `ブラックジャック`;
    if (data.player_total > 21) {
      data.player_result = `${data.player_total}でバースト`;
      data.result = "ディーラーの勝ち"
    } else if (data.player_total == 21) {
      data.player_result = "ブラックジャック";
      data.result = "引き分け";
    } else {
      data.player_result = `${data.player_total}`;
      data.result = "ディーラーの勝ち";
    }
  } else {
    data.dealer_result = `${data.dealer_total}`;
    if (data.player_total > 21) {
      data.player_result = `${data.player_total}でバースト`;
      data.result = "ディーラーの勝ち"
    } else if (data.player_total == 21) {
      data.player_result = "ブラックジャック";
      data.result = "プレイヤーの勝ち";
    } else {
      data.player_result = `${data.player_total}`;
      if (data.dealer_total > data.player_total) {
        data.result = "ディーラーの勝ち";
      } else if (data.dealer_total == data.player_total) {
        data.result = "引き分け";
      } else {
        data.result = "プレイヤーの勝ち";
      }
    }
  }
}

function calculate() {
  if (data.result == "ディーラーの勝ち") {
    console.log(`賭け金の$${data.bet}は没収です`);
  } else if (data.result == "引き分け") {
    console.log(`賭け金の$${data.bet}はそのままお返しします`);
    data.money += data.bet;
  } else {
    if (data.player_result == "ブラックジャック") {
      console.log(`賭け金の$${data.bet}の2.5倍をお返しします`);
      data.money += Math.floor(data.bet * 2.5);
    } else {
      console.log(`賭け金の$${data.bet}の2倍をお返しします`);
      data.money += Math.floor(data.bet * 2);
    }
  }
  console.log(`所持金は$${data.money}になりました`)
}

function nextGame_bool() {
  return new Promise((resolve) => {
    readline.question("ゲームを続けますか？ (y/n): ", (answer) => {
      if (answer.toLowerCase() === "y") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}



async function Game() {
  console.log(`あなたの所持金は$${data.money}です。`);
  data.bet = await askBet();
  data.money -= data.bet;
  console.log(`入力された賭け金: $${data.bet}`);

  ["dealer", "player"].forEach((participant) => {
    for (let i = 0; i < 2; i++) {
      const [num, card] = dealCards();
      data[participant][0].push(num);
      data[participant][1].push(card);
    }
  });

  console.log(`ディーラー\n　1枚目: ${data.dealer[1][0]}\n　2枚目: 秘密`);
  console.log(`プレイヤー\n　1枚目: ${data.player[1][0]}\n　2枚目: ${data.player[1][1]}`);

  for (const participant of ["dealer", "player"]) {
    for (let i = 0; i < 2; i++) {
      await one_or_eleven(i, participant);
    }
  }

  for (let i = 0; data.player_loop == true || data.dealer_loop == true; i++) {
    if (data.dealer_loop == true) {
      const bool = await askDrawCard("dealer");
      if (bool == true) {
        console.log("ディーラーは1枚引きます");
        const [num, card] = dealCards()
        data.dealer[0].push(num);
        data.dealer[1].push(card);
        one_or_eleven(i+2, "dealer");
      } else {
        data.dealer_loop = false
        console.log("ディーラーはカードを引きません");
      }
    };
    if (data.player_loop == true) {
      const bool = await askDrawCard("player");
      if (bool == true) {
        const [num, card] = dealCards();
        console.log(`${card}を引きました`)
        data.player[0].push(num);
        data.player[1].push(card);
        await one_or_eleven(i+2, "player");
      } else {
        data.player_loop = false
      }
    };
  }

  result()
  console.log()
  console.log(`ディーラー　${data.dealer_result}\n　[${data.dealer[1]}]`)
  console.log(`プレイヤー　${data.player_result}\n　[${data.player[1]}]`)
  console.log(`結果: ${data.result}`)

  console.log()
  calculate()

  const next = await nextGame_bool()
  if (next && data.money > 0) {
    console.log("---Next Game---");
    //console.log(data)
    data.bet = 0;
    data.dealer = [[], []]; //[1,2,3,...,13], [A,2,3,...,K]]
    data.player = [[], []]; //[1,2,3,...,13], [A,2,3,...,K]]
    data.dealer_total = 0;
    data.player_total = 0;
    data.dealer_loop = true;
    data.player_loop = true;
    data.dealer_result = null;
    data.player_result = null;
    data.result = null;
    await Game();
  } else if (next && data.money == 0) {
    console.log("金持ってねーじゃん");
    readline.close();
  } else {
    console.log("終了します");
    readline.close();
  }
}

Game()