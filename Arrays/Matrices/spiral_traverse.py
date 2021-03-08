def spiralTraverse(array):
    # O(m*n) T & S where m*n is the total number of elements in the 2d array
    out = []
    i, j = 0, 0
    i_lower_bound, i_upper_bound = 0, len(array) - 1
    j_lower_bound, j_upper_bound = 0, len(array[i]) - 1
    size = len(array) * len(array[0])

    while len(out) < size:  # while in bounds
        while j <= j_upper_bound and len(out) < size:
            out.append(array[i][j])
            j += 1
        j -= 1  # fix col out of bounds
        i += 1  # go down a row
        i_lower_bound = i

        while i <= i_upper_bound and len(out) < size:
            out.append(array[i][j])
            i += 1
        i -= 1  # fix row out of bounds
        j -= 1  # go left a col
        j_upper_bound = j

        while j >= j_lower_bound and len(out) < size:
            out.append(array[i][j])
            j -= 1
        j += 1  # fix col out of bounds
        i -= 1  # go up a row
        i_upper_bound = i

        while i >= i_lower_bound and len(out) < size:
            out.append(array[i][j])
            i -= 1
        i += 1  # fix row out of bounds
        j += 1  # go right a col
        j_lower_bound = j

    return out
