def getPermutations(array):
    # time: O(n*n!) - base case takes O(n) work and is called n! times
    # space: O(n*n!) - storing n! copies of len n input array
    permutations = []
    permutationsHelper(0, array, permutations)
    return permutations


def permutationsHelper(i, array, permutations):
    if i == len(array) - 1:
        # append copy not same array otherwise it will mess up after first append
        permutations.append(array[:])
    else:
        for j in range(i, len(array)):
            array[i], array[j] = array[j], array[i]  # swap, no op when j == i
            permutationsHelper(i + 1, array, permutations)
            array[i], array[j] = array[j], array[i]  # swap back
