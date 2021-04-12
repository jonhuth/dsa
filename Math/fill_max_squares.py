def fill_max_squares_recursive(length, width):
    '''
    prompt: given a rectangle of dimensions, length & width,
    return the side length of a square with the largest dimensions
    that can be used to tile the rectangle

    key insight: think about greatest common denominator algorithm

    recursive soln.
    time: O(log(length + width)) | space: O(log(length + width))
    '''

    short, long = min(length, width), max(length, width)
    if long % short == 0:  # base case: long side is multiple of short side
        return short
    return fill_max_squares_recursive(short, long % short)


print(f'{10, 52} => {fill_max_squares_recursive(10, 52)}')
print(f'{11, 1010} => {fill_max_squares_recursive(11, 1010)}')
print(f'{51, 52} => {fill_max_squares_recursive(51, 52)}')
print(f'{1680, 640} => {fill_max_squares_recursive(1680, 640)}')


def fill_max_squares_iterative(length, width):
    '''
    prompt: given a rectangle of dimensions, length & width,
    return the side length of a square with the largest dimensions
    that can be used to tile the rectangle

    key insight: think about greatest common denominator algorithm

    iterative soln.
    time: O(log(length + width)) | space: O(1)
    '''

    short, long = min(length, width), max(length, width)
    while short > 0:
        if long % short == 0:
            return short
        long, short = short, long % short

    return short


print(f'{10, 52} => {fill_max_squares_iterative(10, 52)}')
print(f'{11, 1010} => {fill_max_squares_iterative(11, 1010)}')
print(f'{51, 52} => {fill_max_squares_iterative(51, 52)}')
print(f'{1680, 640} => {fill_max_squares_iterative(1680, 640)}')
