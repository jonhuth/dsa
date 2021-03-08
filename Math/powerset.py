def powerset(array):
    # time: O(n*2^n) | space: O(n*2^n)
    pset = [[]]
    for ele in array:
        for i in range(len(pset)):
            pset.append(pset[i] + [ele])
    return pset
