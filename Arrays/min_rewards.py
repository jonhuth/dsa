def min_rewards(scores):
    '''
    given list of scores, return the min num of rewards that you must give out
    to students to satisfy the following rules.
    reward rules:
    1. all students get >= 1 reward
    2. every student must receive strictly more than adjacent student w/ lower
       score and strictly less than adj student w/ higher score
    assume:
    all scores are unique

    ex:
    scores = [8, 4, 2, 1, 3, 6, 7, 9, 5]
    rewards =[1, 1, 1, 1, 1, 1, 1, 1, 1]
    after 1st pass (l to r)
             [1, 1, 1, 1, 2, 3, 4, 5, 1]
    after 2nd pass (r to l)
             [4, 3, 2, 1, 2, 3, 4, 5, 1]
    => sum = 25

    soln: O(n) T | O(n) S
    '''
    if len(scores) == 1:
        return 1
    rewards = [1] * len(scores)  # all students must get >= 1 reward
    for i in range(1, len(scores)):  # l to r
        if scores[i] > scores[i - 1]:  # going up
            rewards[i] = rewards[i - 1] + 1
    for i in range(len(scores) - 2, -1, -1):  # r to l
        if scores[i] > scores[i + 1]:  # going down
            rewards[i] = max(rewards[i], rewards[i + 1] + 1)
    return sum(rewards)
