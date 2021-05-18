# Definition for singly-linked list.
from typing import List


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def kth_to_last(head: ListNode, k: int) -> int:
    '''
    Implement an algorithm to find the kth to last element of a singly linked
    list.

    assumptions:
    if head is None, return None
    k in [1, n] -> kth to last element is n-k
    where n = num nodes in LL.

    time: O(n) | space: O(1)
    '''
    curr, n = head, 0
    while curr:
        curr = curr.next
        n += 1
    curr, target = head, n-k
    if target < 0:
        return
    while target > 0:
        curr = curr.next
        target -= 1
    if not curr:
        return
    return curr.val


# empty => None
h1 = None
print(kth_to_last(h1, 1))
# 1 -> 2 -> 3 -> 4, 1 => 4
h2 = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
print(kth_to_last(h2, 1))
# 1 -> 2 -> 3 -> 4, 2 => 3
h3 = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
print(kth_to_last(h3, 2))
# 1 -> 2 -> 3 -> 4, 5 => None
h4 = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
print(kth_to_last(h4, 5))
# 1 -> 2 -> 3 -> 4, 4 => 1
h4 = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
print(kth_to_last(h4, 4))
