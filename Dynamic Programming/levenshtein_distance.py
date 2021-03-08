def levenshteinDistance(str1, str2):
    # soln: O(m*n) T | O(min(m, n)) S
    # m is the num of rows (len of longest_str), n is the num of cols (len of shorte)
    m, n = len(str1) + 1, len(str2) + 1
    longest_str_len, shortest_str_len = max(m, n), min(m, n)
    longest_str = str1 if m >= n else str2
    shortest_str = str1 if m < n else str2
    e = [list(range(shortest_str_len))] if longest_str_len < 2 else [
        [1] + [0] * (shortest_str_len - 1), list(range(shortest_str_len))]

    for i in range(1, longest_str_len):
        e[0], e[1] = e[1], e[0]
        e[1][0] = i
        for j in range(1, shortest_str_len):
            if longest_str[i-1] == shortest_str[j-1]:
                e[1][j] = e[0][j-1]
            else:
                upLeft, left, up = e[0][j-1], e[1][j-1], e[0][j]
                e[1][j] = 1 + min(upLeft, left, up)

    return e[-1][-1]
