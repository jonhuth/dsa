class LinkedStack:
    '''
    Linked List based implementation of Stack data structure
    '''
    class ListNode:
        def __init__(self, x):
            self.val = x
            self.next = None

    def __init__(self):
        self.head = None

    def is_empty(self):
        return self.head is None

    def peek(self):
        return self.head.val

    def pop(self):
        '''
        time: O(1) | space: O(1)
        '''
        oldHead = self.head
        self.head = self.head.next
        return oldHead.val

    def push(self, number):
        '''
        time: O(1) | space: O(1)
        '''
        oldHead = self.head
        newHead = self.ListNode(number)
        self.head = newHead
        newHead.next = oldHead
