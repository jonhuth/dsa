def arithmeticEval(expression):
    '''
    prompt:
    given a valid arithmetic expression, evaluate and return the result.

    example:
    ((2 * (3 / 3)) + 3 * (7 - 3))) => 14

    solution:
    based on Dijkstra's two stack algorithm. 
    can be extended to other functions and can start to form basis of compiler.
    time: O(n) | space: O(n)
    '''
    vals, operators = [], []
    for symbol in expression:
        if symbol.isdigit():
            vals.append(int(symbol))
        elif symbol in '+-/*':
            operators.append(symbol)
        elif symbol == ')':
            right, left = vals.pop(), vals.pop()
            operator = operators.pop()
            subresult = eval(str(left)+operator+str(right))
            vals.append(str(int(subresult)))  # put back on stack of values

    return int(vals.pop())
