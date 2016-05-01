def print_number(n, m, x):

    m1 =  m/3
    m1 = int(m1)

    # space
    print((n+1) * "#")

    # line 1
    if x == 1:
        pattern001(n)
    elif x == 4:
        pattern101(n)
    else:
        pattern111(n)

    # line 2
    a = 1
    while a <= m1:
        if x in [1, 2, 3, 7]:
            pattern001(n)
        elif x in [5, 6]:
            pattern100(n)
        else:
            pattern101(n)
        a += 1

    # line 3
    if x in [1, 7]:
        pattern001(n)
    elif x == 0:
        pattern101(n)
    else:
        pattern111(n)

    # line 4
    a = 1
    while a <= m1:
        if x == 2:
            pattern100(n)
        elif x in [0, 6, 8]:
            pattern101(n)
        else:
            pattern001(n)
        a += 1

    # line 5
    if x in [1, 4, 7]:
        pattern001(n)
    else:
        pattern111(n)

def pattern001(n):
    print((n-1) * " " + "*")

def pattern100(n):
    print("*" + (n-1) * " ")

def pattern101(n):
    print("*" + (n-2) * " " + "*")

def pattern111(n):
    print(n * "*")

def main():

    numbers = []
    with open('input1.txt') as inputfile:
        for line in inputfile:
            numbers.append(line.strip())

    n = numbers.pop(0)
    m = numbers.pop(0)

    n = int(n)
    m = int(m)

    for x in numbers:
        x = int(x)
        print_number(n, m, x)

main()
