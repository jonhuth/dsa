from collections import Counter


def is_permutation(s1, s2):
    '''
    given two strings, write a method to decide if one is a permutation of the other.

    compare two counter hash tables.
    time: O(n) | space: O(1) - assuming fixed char set like ascii
    '''
    if len(s1) != len(s2):
        return False
    counter1, counter2 = Counter(s1), Counter(s2)
    for ltr in counter1:
        if counter1[ltr] != counter2[ltr]:
            return False

    return True


print(is_permutation('abc', 'abc'))
print(is_permutation('abc', 'cba'))
print(is_permutation('abcc', 'abc'))
