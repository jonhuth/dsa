def shortest_balanced_substring(s):
    '''
    given a string, find the shortest balanced substring and return if it
    exists, else return None.

    balanced substring = a contiguous range in the string that only contains
    letters that are both lower and upper case.
    ex. 'abcABC' => balanced substring
    ex. 'aACbcB' => balanced substring

    time: O(n) | space: O(n)
    '''
    shortest, curr = [], []  # note: using char arrays to represent strings
    ltrs, curr_ltrs = set(s), set()  # O(n) t & O(1) s assuming fixed char set
    for c in s:
        if char_is_balanced(c, ltrs):  # balanced
            curr.append(c), curr_ltrs.add(c)
        else:  # balance broken
            curr, curr_ltrs = [], set()  # reset current substring
        if substr_is_balanced(curr, curr_ltrs):
            shortest = curr if is_shorter(curr, shortest) else shortest
            curr, curr_ltrs = [], set()  # reset current substring

    # combine these 2 lines
    if substr_is_balanced(curr, curr_ltrs) and is_shorter(shortest, curr):
        shortest = curr
    return ''.join(shortest) if shortest else None


def is_shorter(current, shortest):
    return not shortest or len(current) < len(shortest)


def char_is_balanced(c, ltrs):
    return c.lower() in ltrs and c.upper() in ltrs


def substr_is_balanced(s, ltrs):
    for ltr in s:
        if not char_is_balanced(ltr, ltrs):
            return False
    return len(s) > 0


print(f"{shortest_balanced_substring('azABaabza')} should return ABaab")
print(f"{shortest_balanced_substring('TacoCat')} should return None")
print(f"{shortest_balanced_substring('AcZCbaBz')} should return AcZCbaBz")
print(f"{shortest_balanced_substring('omOMOMxoommMo')} should return omOM")
print(f"{shortest_balanced_substring('Madam')} should return None")
