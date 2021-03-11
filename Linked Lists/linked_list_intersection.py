# Definition for singly-linked list.
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None


def getIntersectionNode(headA, headB):
    # time: O(m + n) | space: O(1) where n = num nodes in LL A and m for LL B
    n, m = 0, 0
    currA, currB = headA, headB
    while currA:
        n += 1
        currA = currA.next
    while currB:
        m += 1
        currB = currB.next

    lenDiff = abs(m - n)
    if n >= m:  # listA eq or longer, get p1 up to lenDiff
        longer, shorter = headA, headB
    else:  # listB longer, longer pointer up to same index as shorter
        longer, shorter = headB, headA

    for _ in range(lenDiff):
        longer = longer.next
    while longer and shorter:
        if longer is shorter:
            return longer
        longer, shorter = longer.next, shorter.next

    return None
