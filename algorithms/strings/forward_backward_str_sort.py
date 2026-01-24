def sortString(s):
    # time: O(n) | space: O(n) where n is the num of chars in s
    counts = [0] * 26  # counts[0] => 'a', ..., counts[25] => 'z'
    for char in s:
        idx = ord(char) - 97
        counts[idx] += 1

    out = []
    while True:
        flag = True
        for i in range(len(counts)):  # forward
            count = counts[i]
            if count > 0:
                flag = False
                char = chr(i + 97)
                out.append(char)
                counts[i] -= 1

        for i in range(len(counts) - 1, -1, -1):  # backwards
            count = counts[i]
            if counts[i] > 0:
                flag = False
                char = chr(i + 97)
                out.append(char)
                counts[i] -= 1

        if flag:  # if flag still true, break
            break

    return ''.join(out)
