def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    '''
    given an list of intervals, return a new list of intervals where overlapping
    intervals are merged.

    algorithm:
    1. sort intervals in descending order of start time
    2. loop through intervals backwards, looking at 2 intervals at a time
        a. if right interval end >= left start => combine and add to soln. and pop
        both from input
        b. else => pop right and append
    3. add leftover interval if any

    time: O(nlogn) | space: O(n) including output space
    '''
    intervals.sort(key=lambda k: -k[0])
    out = []
    while len(intervals) > 1:
        # right interval starts before left interval
        r_start, r_end = intervals[-1]
        l_start, l_end = intervals[-2]
        if r_end >= l_start:
            merged = [r_start, max(l_end, r_end)]
            intervals.pop(), intervals.pop()
            intervals.append(merged)
        else:
            out.append([r_start, r_end])
            intervals.pop()
    return out + intervals
