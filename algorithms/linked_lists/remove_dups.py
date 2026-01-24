# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def remove_dups(head: ListNode) -> None:
    '''
    write code to remove duplicates from an unsorted linked list.

    follow up: how would you solve this problem if a temporary buffer is not
    allowed?
    w/o extra memory: time: O(n^2) | space: O(1) - for every ele look ahead for
    its duplicates

    using hash table:
    time: O(n) | space: O(n)
    '''
    seen = set([])

    prev, curr = None, head
    while curr:
        if curr.val in seen:
            prev.next = curr.next
            # don't move up prev counter if removing curr duplicate
        else:
            prev = curr
        seen.add(curr.val)
        curr = curr.next


# remove non edge duplicate 1 -> 1 -> 2 => 1 -> 2
h1 = ListNode(1, ListNode(1, ListNode(2)))
remove_dups(h1)
curr = h1
while curr:
    print(curr.val)
    curr = curr.next
# remove last ele which is duplicate 1 -> 2 -> 1 => 1 -> 2
h2 = ListNode(1, ListNode(2, ListNode(1)))
remove_dups(h2)
curr = h2
while curr:
    print(curr.val)
    curr = curr.next
# remove multiple duplicates 1 -> 1 -> 1 => 1
h3 = ListNode(1, ListNode(1, ListNode(1)))
remove_dups(h3)
curr = h3
while curr:
    print(curr.val)
    curr = curr.next
