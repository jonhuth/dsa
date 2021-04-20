# node class for doubly linked list

class ListNode:
    def __init__(self, val=0, prev=None, next=None):
        self.val = val
        self.prev = prev
        self.next = next

# doubly linked list class


class DoublyLinkedList:
    def __init__(self, vals=[]):
        self.head = None
        self.tail = None
        self.length = 0

        for val in vals:
            self.append(val)

    def append(self, val):
        '''add new value to end of LL
        time: O(1) | space: O(1)'''
        new_node = ListNode(val, self.tail)
        if self.tail is None:
            self.head = self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node

        self.length += 1

    def prepend(self, val):
        '''add new value to beginning of LL.
        time: O(1) | space: O(1)'''
        new_node = ListNode(val, None, self.head)
        if self.head is None:
            self.tail = new_node
        else:
            self.head.prev = new_node

        self.head = new_node
        self.length += 1

    def pop(self):
        '''remove last element (tail) in LL.
        return removed node's value
        time: O(1) | space: O(1)'''
        if self.head is None:  # no tail or head
            raise Exception('No element to remove')
        popped_val = self.tail.val
        if self.head == self.tail:
            self.head = self.tail = None
            self.length -= 1
            return popped_val

        self.tail = self.tail.prev
        self.tail.next = None
        self.length -= 1
        return popped_val

    def popleft(self):
        '''remove first element (head) in LL.
        return removed node's value
        time: O(1) | space: O(1)'''
        if self.head is None:  # no tail or head
            raise Exception('No element to remove')
        popped_val = self.head.val
        if self.head == self.tail:
            self.head = self.tail = None
            self.length -= 1
            return popped_val

        self.head = self.head.next
        self.head.prev = None
        self.length -= 1
        return popped_val

    def get_at(self, i):
        '''return val of node at idx i traversing head to tail.
        pythonic implementation: indices in range: [-length, length) accepted
        time: O(n) | space: O(1)'''
        if i >= self.length or i < -self.length:
            raise Exception('index not in range')
        i %= self.length

        curr = self.head
        for _ in range(i):
            curr = curr.next
        return curr.val

    def set_at(self, i, v):
        '''set val of node at idx i traversing head to tail.
        pythonic implementation: indices in range: [-length, length) accepted
        time: O(n) | space: O(1)'''
        if i >= self.length or i < -self.length:
            raise Exception('index not in range')
        i %= self.length

        curr = self.head
        for _ in range(i):
            curr = curr.next
        curr.val = v

    def insert_before(self, i, v):
        '''create new node before node at idx i traversing head to tail
        pythonic implementation: indices in range: [-length, length) accepted
        time: O(n) | space: O(1)
        '''
        if i >= self.length or i < -self.length:
            raise Exception('index not in range')
        if self.head == None:
            self.append(v)
            return
        i %= self.length
        left = right = self.head
        for _ in range(i):
            left = right
            right = right.next
        mid = ListNode(v, left, right)
        left.next = right.prev = mid
        self.length += 1

    def remove_at(self, i):
        '''remove node at index i traversing head to tail
        pythonic implementation: indices in range: [-length, length) accepted
        time: O(n) | space: O(1)
        '''
        if i >= self.length or i < -self.length:
            raise Exception('index not in range')
        if self.head == None:
            raise Exception('no nodes to remove')

        i %= self.length
        if i == self.length - 1:
            return self.pop()

        before = target = self.head
        for _ in range(i):
            before = target
            target = target.next
        before.next = target.next
        target.prev = before
        self.length -= 1
        return target.val

    def average(self):
        '''return avg of node vals.
        time: O(n) | space: O(1)'''
        if self.length == 0:
            return 0
        _sum = 0
        curr = self.head
        while curr:
            _sum += curr.val
            curr = curr.next
        return _sum / self.length

    def reverse_linked_list(self):
        '''reverse doubly linked list
        time: O(n) | space: O(1)'''
        curr = self.tail
        while curr:
            curr.prev, curr.next = curr.next, curr.prev
        self.head, self.tail = self.tail, self.head

# testing


def print_out_ll():
    global curr
    while curr:
        print(curr.val)
        curr = curr.next


l1 = SinglyLinkedList([1, 2, 3])
curr = l1.head
print_out_ll()


l1.prepend(0)
curr = l1.head
print_out_ll()

l1.pop()
curr = l1.head
print_out_ll()

# l2 = SinglyLinkedList([])
# l2.pop()

l3 = SinglyLinkedList([1])
l3.pop()
curr = l3.head
print_out_ll()
