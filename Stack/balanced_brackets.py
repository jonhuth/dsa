def balancedBrackets(string):
    # time = O(n) and space = O(n) | {open:close} use hash table for brackets
    openBrackets, closeBrackets = '([{', ')]}'
    matchingBrackets = {'(': ')', '[': ']', '{': '}'}
    stack = []
    for char in string:
        if char in openBrackets:
            stack.append(char)
        elif char in closeBrackets:
            if not stack:
                return False
            if matchingBrackets[stack[-1]] == char:
                stack.pop()
            else:
                return False
    return not stack
