def longest_common_subsequence(s1, s2):
    '''
    given two strings, find the longest common subsequence.
    a common subsequence is defined as the the most characters 
    in a row for two given strings.

    let s1 represent rows, s2 represent columns
    curr count = max(left, up, up_left + 1)
    time: O(m*n) | space: O(m*n)
    '''
    dp = [[0 for _ in range(len(s2) + 1)] for _ in range(len(s1) + 1)]

    for i in range(1, len(dp)):
        for j in range(1, len(dp[0])):
            c1, c2 = s1[i-1], s2[j-1]
            dp[i][j] = max(dp[i][j-1], dp[i-1][j])
            if c1 == c2:
                dp[i][j] = max(dp[i][j], dp[i-1][j-1] + 1)

    return get_lcs_letters(s1, dp)


def get_lcs_letters(string, dp):
    '''
    after filling out dp table, work backwards from last element (dp[-1][-1])
    if curr ele == one above, move row back
    elif curr ele == one to right, move col back
    else:
        we had matching letter, go to next ele on diagonal
        moving towards the start [0][0]
        append ltr to output

    '''
    seq = []
    i, j = len(dp) - 1, len(dp[0]) - 1
    while i > 0 and j > 0:
        if dp[i][j] == dp[i-1][j]:
            i -= 1
        elif dp[i][j] == dp[i][j-1]:
            j -= 1
        else:
            seq.append(string[i-1])
            i -= 1
            j -= 1
    return list(reversed(seq))


s1, s2 = 'fish', 'fosh'
print(longest_common_subsequence(s1, s2))
s3, s4 = 'ab', 'acb'
print(longest_common_subsequence(s3, s4))
s5, s6 = 'allergy', 'lepegy'
print(longest_common_subsequence(s5, s6))
