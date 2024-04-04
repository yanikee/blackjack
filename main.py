import random
import time


l = [1,11]

def explane_rules():
    print("①ディーラーとプレイヤーに2枚ずつカードが配られます")
    print("　この時ディーラーのカードは1枚だけ公開されます")
    time.sleep(1)
    print("②カードの合計が21に近いほど強いカードとなるので、")
    print("新たにカードを引くか引かないか、選んでもらいます。")
    time.sleep(0.5)
    print("あ、絵札は全部10としてカウントね")
    print("あとAが出たら1か11か選べるよん")
    time.sleep(1)
    print()
    print("あとはもうやればわかる！がんばれ！")
    answer = input("準備はいい？Y/N ")
    if answer == "Y" or answer == "y":
        print()
    else:
        print("まぁNって打っても強制的に始めるけどね()")
        print()

def start():
    print("ブラックジャックを始めます")
    time.sleep(0.5)
    answer = input("ルールは分かりますか？ Y/N ")
    if answer == "Y" or answer == "y":
        time.sleep(0.5)
        print()
    elif answer == 'N' or answer == "n":
        print("ルールを説明します")
        time.sleep(1)
        print()
        explane_rules()

start()

loop = "on"
money = 5

while loop == "on":
    oneven = [1,11]
    dealer = []
    dealer_te = []
    player = []
    player_te = []
    
    dealer_loop = "on"
    player_loop = "on"

    # カード置き換え
    # カードが引かれたら絶対このコード通ってます(?)
    def okikae(card):
        global tehuda
        if card == 1:
            tehuda = "A"
        elif card == 11:
            tehuda = "J"
            card = 10
        elif card == 12:
            tehuda = "Q"
            card = 10
        elif card == 13:
            tehuda = "K"
            card = 10
        else:
            tehuda = str(card)
        return card

    # プレイヤーの1枚目にAが来た時の処理
    def player_oneven(card,n):
        if card == 1:
            print("プレイヤーの" + str(n) + '番目のカードは"A"でした。')
            print('"1"と"11"のどちらとしてカウントしますか。')
            card = int(input("1 or 11 "))
            player[n-1] = card

    # ディーラーの1枚目にAが来た時の処理
    def dealer_oneven():
        if dealer[1] <= 6:
            dealer[0] = 11
        elif dealer[0] >= 7 and dealer[1] <= 11:
            dealer[0] = random.choice(1,11)
        else:
            dealer[0] = 1

          
    # ここから
    print("ブラックジャック始めます。")
    time.sleep(0.5)
    print("参加者はあなた、ディーラーです。")
    time.sleep(0.5)
    print("あなたの持ち金は$" + str(money) + "です。")
    time.sleep(0.5)
    print("いくら賭けますか？")
    print('"all"と入力すれば全賭けできます。')

    # いくら賭けるか
    # 隠しコマンドで1234567890と入力すると上限突破します
    input_money = "on"
    while input_money == "on":
        kakekin = input("($" +str(money) + "以下,整数で入力してください。) ")
        if kakekin == "1234567890":
            kakekin = int(input("? "))
            money = kakekin
            input_money = "off"
        elif kakekin == "all":
            print("全賭けします。")
            kakekin = money
            input_money = "off"
        elif int(kakekin) > money:
            print("$" + str(money) + "以下にしてください")
        elif int(kakekin) <= 0:
            print("0より大きい整数にしてください")
        else:
            kakekin = int(kakekin)
            input_money = "off"
    input_money = "on"
    print("$" + str(kakekin) + "ですね。")
    money = money - kakekin
    print("")
    time.sleep(0.5)
    print("ディーラーがカードを配ります。")
    print("")   
    time.sleep(1)

    # カードをランダムで選びます
    for i in range(2):
        dealer.append(random.randint(1,13))
        player.append(random.randint(1,13))

    # 選んだカードを表示します
    dealer[0] = okikae(dealer[0])
    dealer_te.append(tehuda)
    print('ディーラーの1枚目のカードは"' + tehuda + '"')
    dealer[1] = okikae(dealer[1])
    dealer_te.append(tehuda)
    print("ディーラーの2枚目のカードは秘密です。")
    player[0] = okikae(player[0])
    player_te.append(tehuda)
    print('プレイヤーの1枚目のカードは"' + tehuda + '"')
    player[1] = okikae(player[1])
    player_te.append(tehuda)
    print('プレイヤーの2枚目のカードは"' + tehuda + '"')
    print()

    # 先に、ディラーの2枚目のカードに1が出た時の場合をランダムで決めちゃいます
    # だって楽だから
    if dealer[1] == 1:
        dealer[1] = int(random.choice(l))
    # んで、ディーラーの1枚目の場合も決める
    if dealer[0] == 1:
        dealer_oneven()
        print('ディーラーの1枚目の"A"は' + str(dealer[0]) + 'としてカウントします。')
        print("")
    
    player_oneven(player[0],1)
    player_oneven(player[1],2)    
    
    time.sleep(0.5)

    # ディーラーが新しいカードを引くか引かないかです
    # ディーラーの合計が15未満だったら必ず引く
    # 15、16、17だったら1/2の確率で引く
    # 18以降は引かないようになっています。
    def dealer_hikukahikanaika():
        global dealer_loop
        if sum(dealer) < 15:
            print("ディーラーは1枚引きます。")
            dealer.append(okikae((random.randint(1,13))))
            dealer_te.append(tehuda)
        elif sum(dealer) >= 15 and sum(dealer) <= 17:
            hikukahikanaika = random.randint(1,2)
            if hikukahikanaika == 1:
                print("ディーラーは1枚引きます。")
                dealer.append(okikae((random.randint(1,13))))
                dealer_te.append(tehuda)
            else:
                print("ディーラーはカードを引きません")
                dealer_loop = "off"
        else:
            print("ディーラーはカードを引きません")
            dealer_loop = "off"

    # プレイヤーが新しいカードを引くか引かないかです
    def player_hikukahikanaika(k):
        global player_loop
        print("")
        print("カードを1枚引きますか？")
        player_hikukahikanaika = input("Y/N ")
        if player_hikukahikanaika == "Y" or player_hikukahikanaika == "y":
            num = random.randint(1,13)
            okikae(num)
            player.append(okikae(num))
            player_oneven(num,k)
            player_te.append(tehuda)
            print("プレイヤーの新しいカードは" + tehuda +"です。")
        elif player_hikukahikanaika == "N" or player_hikukahikanaika == "n":
            player_loop = "off"

    # 勝利判定
    def hantei():
        global money
        global kakekin
        print()
        time.sleep(1)
        if sum(dealer) > 21:
            print("ディーラーはバーストしました。")
            if sum(player) > 21:
                print("あなたもバーストしているので引き分けです。")
                money = money + kakekin
            elif sum(player) == 21:
                print("ブラックジャックです！おめでとうございます！")
                print("賭け金" + str(kakekin) + "の2.5倍")
                print("$" + str(kakekin * 2.5) + "でお返しします。")
                money = money + kakekin * 2.5
            else:
                print('あなたの合計は"' + str(sum(player)) + '"でした。')
                print("賭け金" + str(kakekin) + "の2倍")
                print("$" + str(kakekin * 2) + "でお返しします。")
                money = money + kakekin * 2
        elif sum(dealer) == 21:
            print("ディーラーは21ちょうどでした。")
            if sum(player) > 21:
                print("あなたはバーストしてしまったので、")
                print("賭け金の$"+ str(kakekin) + "は没収です。")
            elif sum(player) == 21:
                print("あなたも21でしたので、引き分けです。")
                money = money + kakekin
            else:
                print('あなたの合計は"' + str(sum(player)) + '"でした。')
                print("賭け金$" + str(kakekin) + "は没収されます。")
        elif sum(dealer) < 21:
            if sum(player) > 21:
                print("あなたはバーストしてしまったので、")
                print("賭け金の$"+ str(kakekin) + "は没収です。")
            elif sum(player) == 21:
                print("ブラックジャックです！おめでとうございます！")
                print("賭け金" + str(kakekin) + "の2.5倍")
                print("$" + str(kakekin * 2.5) + "でお返しします。")
                money = money + kakekin * 2.5
            else:
                if sum(dealer) < sum(player):
                    print("プレイヤーの方が21に近いので")
                    print("あなたの勝ちです！")
                    print("賭け金" + str(kakekin) + "の2倍")
                    print("$" + str(kakekin * 2) + "でお返しします。")
                    money = money + kakekin * 2
                elif sum(dealer) == sum(player):
                    print("引き分けです。")
                    money = money + kakekin
                else:
                    print("ディーラーの方が21に近いので")
                    print("ディーラーの勝利です。")
                    print("賭け金の$"+ str(kakekin) + "は没収です。")        
    print()

    # 新しいカードを引くか引かないか尋ねます。
    dealer_hikukahikanaika()
    player_hikukahikanaika(3)

    # さらに新しいカードを引くか引かないかをやってます
    # 新しいカードを引かない時はdealer_loop, player_loop が "off"になります。
    for k in range(10):
        if dealer_loop == "off":
            pass
        elif dealer_loop == "on":
            dealer_hikukahikanaika()
        if player_loop == "off":
            pass
        elif player_loop == "on":
            player_hikukahikanaika(k+4)

    # どっちが勝ったかな？
    hantei()
    print()

    # 最後にディーラー、プレイヤーの手札を表示します。
    print("ディーラーの手札：",end = "")
    print(dealer_te)
    print("プレイヤーの手札：",end="")
    print(player_te)
    print()

    # 持ち金を表示し、再度プレイするか尋ねます。
    # yes だった場合は、roop = "on"のままなので、whileが最初からはじまります。
    # no だった場合は、roop に "off"を手渡し、whileを抜け出します。
    time.sleep(0.75)
    print("あなたの持ち金は$" + str(money) + "です。")
    time.sleep(0.5)
    print("もう一度やりますか？")
    yaruka = input("Y/N ")
    if yaruka == "Y" or yaruka == "y":
        if money == 0:
            print("おまえもう金ねぇじゃん無理だわぼけぇ")
            print("出直してこいや")
            time.sleep(0.5)
            print("ゲームを終了します。")
            loop = "off"
        else:
            print()
            print()
    else:
        loop = "off"
        print("ゲームを終了します。")