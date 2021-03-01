def gridTraveler(m, n):
    # time: O(2^(m + n)) | space: O(m + n) - space complexity is height of tree
    if m <= 1 or n <= 1:
        return min(m, n)
    return gridTraveler(m - 1, n) + gridTraveler(m, n - 1)
