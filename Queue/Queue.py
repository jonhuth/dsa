class Queue:
    '''
    Linked List based implementation of Stack data structure
    '''
    class ListNode:
        def __init__(self, x):
            self.val = x
            self.next = None

    def __init__(self):
        self.head = None
        self.tail = None

    def is_empty(self):
        return self.head is None

    def dequeue(self):
        '''
        take out from the front of the LL.
        time: O(1) | space: O(1)
        '''
        oldHead = self.head
        self.head = self.head.next
        if self.is_empty():
            self.tail = None
        return oldHead.val

    def enqueue(self, number):
        '''
        add in to the back of the LL
        time: O(1) | space: O(1)
        '''
        oldTail = self.tail
        newTail = self.ListNode(number)
        self.tail = newTail
        if self.is_empty():
            self.head = newTail
        else:  # there is a tail node, this operation is safe
            oldTail.next = newTail
