def threeSumMulti(arr, target: int) -> int:
    # time: O(n^2) | space: O(1)
    MOD = 10**9 + 7
    arr.sort()

    ans = 0
    for i in range(len(arr)):
        target_remain = target - arr[i]
        l, r = i+1, len(arr) - 1
        while l < r:
            l_and_r = arr[l] + arr[r]
            if l_and_r < target_remain:
                l += 1
            elif l_and_r > target_remain:
                r -= 1
            elif arr[l] != arr[r]:
                left = right = 1
                while l + 1 < r and arr[l] == arr[l+1]:
                    left += 1
                    l += 1
                while r - 1 > l and arr[r] == arr[r-1]:
                    right += 1
                    r -= 1
                ans += left * right
                ans %= MOD
                l += 1
                r -= 1
            else:
                ans += (r - l + 1) * (r - l) / 2
                ans %= MOD
                break

    return int(ans)
