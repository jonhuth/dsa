def minRewards(scores):
    # l to r and r to l soln: O(n) T | O(n) S
    if len(scores) == 1:
        return 1
    rewards = [1] * len(scores)
    for i in range(1, len(scores)):
        if scores[i] > scores[i - 1]:  # going up
            rewards[i] = rewards[i - 1] + 1
    for i in range(len(scores) - 2, -1, -1):
        if scores[i] > scores[i + 1]:  # going down
            rewards[i] = max(rewards[i], rewards[i + 1] + 1)
    return sum(rewards)
