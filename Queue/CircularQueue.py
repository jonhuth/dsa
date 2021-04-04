class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class MyCircularQueue:
    '''
    Linked List based implementaion of a circular queue data structure.
    Similar to a regular queue, a circular queue has a pointer at the back of the queue
    that points back to the front  of the queue

    the front of the queue (the head of a LL) contains the oldest item in the queue
    and is thus removed first (in accordance with FIFO principle).

    the back of the queue (the tail of a LL) contains the newest item
    '''

    def __init__(self, k: int):
        # front -> back -> front
        self.limit = k
        self.size = 0
        self.front = None
        self.back = None

    def enQueue(self, value: int) -> bool:
        if self.size == self.limit:
            return False
        newNode = ListNode(val=value)
        if self.isEmpty():
            self.front = newNode
            self.back = newNode
            self.back.next = self.front
        else:  # there is a front and back
            oldBack = self.back
            self.back = newNode
            oldBack.next = self.back
            self.back.next = self.front

        self.size += 1
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False
        newFront = self.front.next
        self.back.next = newFront
        self.front = newFront
        self.size -= 1
        return True

    def Front(self) -> int:
        return -1 if self.isEmpty() else self.front.val

    def Rear(self) -> int:
        return -1 if self.isEmpty() else self.back.val

    def isEmpty(self) -> bool:
        return self.size == 0

    def isFull(self) -> bool:
        return self.size == self.limit


# Your MyCircularQueue object will be instantiated and called as such:
# obj = MyCircularQueue(k)
# param_1 = obj.enQueue(value)
# param_2 = obj.deQueue()
# param_3 = obj.Front()
# param_4 = obj.Rear()
# param_5 = obj.isEmpty()
# param_6 = obj.isFull()
