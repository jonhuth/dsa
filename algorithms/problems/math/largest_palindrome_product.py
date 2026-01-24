

def largest_palindrome_product():
    ''' 3 digit x 3 digit (max 999*999)'''
    ans = 0
    for i in range(999, 99, -1):
        for j in range(999, 99, -1):
            curr = i * j
            if is_palindrome(str(curr)):
                print(i, j)
                ans = max(ans, curr)
    return ans

# todo - import instead of copy, restructure packages
def is_palindrome(s, i=0):
    '''
    return whether input string is palindrome or not.

    >>> is_palindrome('')
    True
    >>> is_palindrome('a')
    True
    >>> is_palindrome('haah')
    True
    >>> is_palindrome('mapam')
    True
    >>> is_palindrome('interesting')
    False
    >>> is_palindrome('nonce')
    False

    >>> is_palindrome('noon')
    True

    time: O(n) | space: O(n)
    '''
    if i == len(s)//2:  # base case 0: s[i] == s[-i - 1] for all i
        return True
    if s[i] != s[-(i+1)]:  # base case 1: break early
        return False
    return is_palindrome(s, i + 1)

print(largest_palindrome_product())