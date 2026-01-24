def generate_parenthesis(n: int) -> list[str]:
    '''
    Given n pairs of parentheses, write a function to generate all combinations
    of well-formed parentheses.

    time: O((4**n)/sqrt(n)) | space: O((4**n)/sqrt(n))
    '''
    left = right = n

    def generate(left, right, curr, results=[]):
        if right == 0:
            results.append(curr)
            return
        if left != 0:  # go left
            generate(left-1, right, curr + '(', results)

        if right != 0 and right > left:  # go right
            generate(left, right-1, curr + ')', results)
        return results

    return generate(left, right, '')


print(generate_parenthesis(3))
