def levenshteinDistance(str1, str2):
    '''
    write a fn. that takes in two strings and returns min num edit ops to
    convert str1 -> str2.
    3 edit ops: insert, delete or substitute a char for another.

    soln: O(m*n) T | O(min(m, n)) S
    m is the num of rows (len of long_str), n is the num of cols (len of short_str)
    '''
    m, n = len(str1) + 1, len(str2) + 1
    long_len, short_len = max(m, n), min(m, n)
    long_str = str1 if m >= n else str2
    short_str = str1 if m < n else str2
    e = [list(range(short_len))] if long_len < 2 else [
        [1] + [0] * (short_len - 1), list(range(short_len))]

    for i in range(1, long_len):
        e[0], e[1] = e[1], e[0]
        e[1][0] = i
        for j in range(1, short_len):
            if long_str[i-1] == short_str[j-1]:
                e[1][j] = e[0][j-1]
            else:
                upLeft, left, up = e[0][j-1], e[1][j-1], e[0][j]
                e[1][j] = 1 + min(upLeft, left, up)

    return e[-1][-1]
