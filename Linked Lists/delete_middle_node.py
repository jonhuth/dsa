# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def delete_middle_node(mid: ListNode) -> None:
    '''
    Implement an algorithm to delete a node in the middle of a singly linked
    list, given only access to that node.

    notes:
    1. doesn't work if given node is last node

    algorithm:
    1. stop on 2nd to last node, and dereference last node
    2. copied vals left remove last node which is duplicate

    ex: 1 -> 5 -> 9 -> 12 => 1 -> 5 -> 12

    time: O(n) | space: O(1)
    '''
    if mid is None or mid.next is None:  # if mid is None or last node
        return
    prev, curr = mid, mid.next
    while curr.next:
        prev.val = curr.val
        prev, curr = curr, curr.next
    prev.val, prev.next = curr.val, None


# 1 -> 5 -> 9 -> 12, remove node 9 => 1 -> 5 -> 12
mid1 = ListNode(9, ListNode(12))
h1 = ListNode(1, ListNode(5, mid1))
delete_middle_node(mid1)
curr = h1
while curr:
    print(curr.val)
    curr = curr.next
print('--------')
# 1 -> 5 -> 9 -> 12, remove node 1 => 5 -> 9 -> 12
h2 = mid2 = ListNode(1, ListNode(5, ListNode(9, ListNode(12))))
delete_middle_node(mid2)
curr = h2
while curr:
    print(curr.val)
    curr = curr.next
print('--------')
# 1 -> 5 -> 9 -> 12, remove node 5 => 1 -> 9 -> 12
mid3 = ListNode(5, ListNode(9, ListNode(12)))
h3 = ListNode(1, mid3)
delete_middle_node(mid3)
curr = h3
while curr:
    print(curr.val)
    curr = curr.next
