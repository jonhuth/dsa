# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

    def findMode(root):
        '''
        prompt:
        given BST w/ duplicates, return all the mode(s)
        mode = most frequent element.
        if the tree has more than one mode, return them in any order

        insight:
        equal vals will always be in parent -> child relationship down a path

        time: O(n) | space: O(logn) - from call stack
        '''
        def inorder(root, finding_max):
            nonlocal max_count, curr_count, prev_val
            if root is None:
                return
            inorder(root.left, finding_max)
            curr_count = 1 if prev_val != root.val else curr_count + 1

            if not finding_max:
                max_count = max(max_count, curr_count)

            elif curr_count == max_count:
                ans.append(root.val)
            prev_val = root.val
            inorder(root.right, finding_max)

        max_count, curr_count, prev_val = 0, 0, None
        ans = []
        if root is None:
            return ans
        inorder(root, False)  # find max count
        prev_val, curr_count = -1, 0
        inorder(root, True)
        return ans

#         def findMode(root):
#         '''
#         time: O(n) | space: O(n)

#         follow up: how to use no extra space??
#         1. binary search for max frequency
#         2. binary search again to find vals that have max frequency
#         3. return out arr of max frequency vals
#         time: O(n) | space: O(1)
#         '''

#         counts = {} # val: count
#         maxFreq = 0
#         def dfs(root):
#             nonlocal maxFreq
#             if not root:
#                 return
#             counts[root.val] = counts.get(root.val, 0) + 1
#             maxFreq = max(maxFreq, counts[root.val])
#             for child in [root.left, root.right]:
#                 if child:
#                     dfs(child)

#         dfs(root)
#         return [key for key in counts if counts[key] == maxFreq]
