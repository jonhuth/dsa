def even_fibs_sum():
    # works fine
    # left, right = 1, 2
    # ans = 0
    # while right <= 4 * 10**6:
    #     ans += right if right % 2 == 0 else 0
    #     left, right = right, right + left
    
    # return ans

    # using even recurrence relation: E(n) = 4*E(n-1) + E(n-2)
    left, right = 2, 8
    ans = 2
    while right <= 4 * 10**6:
        ans += right
        left, right = right, 4 * right + left 
    return ans


print(even_fibs_sum())
