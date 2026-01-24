# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def isPalindrome(head: ListNode) -> bool:
    # time: O(n) | O(1)
    # find end node and halway node of LL using 2 runners
    # 1 -> 2 -> 3 -> 4
    half = end = head
    while end:
        half = half.next
        end = end.next
        if end:
            if not end.next:
                break
            end = end.next

    # reverse second half of LL in place
    prev, curr = None, half
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    # p1 [0, half] p2 [len(LL), half]
    p1, p2 = head, prev
    while p1 and p2:
        if p1.val != p2.val:
            return False
        p1, p2 = p1.next, p2.next
    return True
