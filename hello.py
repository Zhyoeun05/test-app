import random


def guess_number():
    target = random.randint(1, 100)
    attempts = 0
    max_attempts = 7

    print("=== 猜数字游戏 ===")
    print("我想了一个 1 到 100 之间的数字，你有 {} 次机会猜中它。".format(max_attempts))

    while attempts < max_attempts:
        remaining = max_attempts - attempts
        print("\n剩余机会: {} 次".format(remaining))

        try:
            user_input = input("请输入你的猜测: ")
            guess = int(user_input)
        except (ValueError, EOFError):
            if attempts > 0:
                print("\n游戏结束！正确答案是: {}".format(target))
            else:
                print("请输入一个有效的整数！")
            return

        attempts += 1

        if guess < target:
            print("太小了！")
        elif guess > target:
            print("太大了！")
        else:
            print("\n恭喜！你在第 {} 次猜中了！答案就是 {}。".format(attempts, target))
            return

    print("\n游戏结束！正确答案是: {}".format(target))


if __name__ == "__main__":
    guess_number()
