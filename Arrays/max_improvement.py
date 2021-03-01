def maxImprovement(students, scores):
    # time: O(n) | space: O(n) where n = len of students arr
    maxDiff = 0
    m = {}  # student: minScore
    for i, student in enumerate(students):
        if student not in m:
            m[student] = scores[i]
        else:
            m[student] = min(m[student], scores[i])
        maxDiff = max(maxDiff, scores[i] - m[student])

    return maxDiff


print(maxImprovement(['a', 'a', 'a', 'a'], [10, 55, 5, 60]))
print(maxImprovement(['a', 'a', 'a', 'a', 'b', 'b'], [10, 55, 5, 60, 2, 92]))
