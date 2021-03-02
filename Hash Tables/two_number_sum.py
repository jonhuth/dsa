def twoNumberSum(array, targetSum):
    # time: O(n) | space: O(n)
    s = set()

       for e in array:
            complement = targetSum - e
            if complement in s:
                return [complement, e]  # found pair
            else:
                s.add(e)
        return []  # didn't find pair
