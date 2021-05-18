from string import printable


def is_unique(s):
    '''
    prompt: implement an algorithm to determine if a string has all unique
    characters. What if you cannot use additional data structures?

    using hash table:
    build counter object for each char in s
    look through counter and return false early if obj[c] > 1
    otherwise get to end and return True

    w/o aux table:
    loop through each char (assuming fixed set of chars)
    track count of curr char
    loop through s
        if s[i] == curr_char count += 1
        if count > 1 return false

    return true

    time: O(n) | space: O(1) - O(n) assuming fixed set of chars otherwise
    variable num of outer loop iterations.
    '''
    for char in printable:
        count = 0
        for c in s:
            if c == char:
                count += 1
            if count > 1:
                return False
    return True


print(is_unique('abcdd'))
print(is_unique('abc!!'))
print(is_unique('abc'))
