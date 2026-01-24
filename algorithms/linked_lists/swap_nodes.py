class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def swapNodes(head: ListNode, k: int) -> ListNode:
    # time: O(n) | space: O(1)
    n = 0
    curr = head
    while curr:
        curr = curr.next
        n += 1

    left = head
    for _ in range(k - 1):
        left = left.next

    right = head
    for _ in range(n - k):
        right = right.next

    right.val, left.val = left.val, right.val
    return head
