def isPalindrome(string):
	# time: O(n) | space: O(1)
    for i in range(len(string)):
        if string[i] != string[len(string) - i - 1]:
            return False
    return True
