def find_mid_class(classes):
    '''
    given classes in the pair form [prereq, class], find the middle class to be
    take.

    notes:
    1. the middle class for even num classes = the left mid
    2. assume positive num classes in the input arr
    time: O(n) | space: O(n) - where n is num class pairs in input.
    '''
    if not classes:
        return ''

    num_classes = len(classes) + 1
    clss_lookup = {}  # prereq: class

    for class_pair in classes:
        prereq, clss = class_pair
        clss_lookup[prereq] = clss

    classes_w_prereqs = set(clss_lookup.values())
    for prereq in clss_lookup:  # find starting class
        if prereq not in classes_w_prereqs:
            curr_class = prereq

    mid = num_classes // 2
    if num_classes % 2 == 0:
        mid -= 1

    while mid > 0:
        curr_class = clss_lookup[curr_class]
        mid -= 1

    return curr_class


prereqs_classes1 = [
    ['a', 'b'],
    ['d', 'e'],
    ['b', 'c'],
    ['c', 'd']
]
prereqs_classes2 = [
    ['c', 'd'],
    ['a', 'b'],
    ['b', 'c']
]
prereqs_classes3 = [
    ['c', 'd']
]

print(find_mid_class(prereqs_classes1))
print(find_mid_class(prereqs_classes2))
print(find_mid_class(prereqs_classes3))
