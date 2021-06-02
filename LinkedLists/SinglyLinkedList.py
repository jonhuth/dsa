# node class for singly linked list

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# singly linked list class


class SinglyLinkedList:
    def __init__(self, vals=[]):
        self.head = None
        self.tail = None
        self.length = 0

        for val in vals:
            self.append(val)

    def append(self, val):
        '''add new value to end of LL
        time: O(1) | space: O(1)'''
        new_node = ListNode(val)
        if self.tail is None:
            self.head = self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node

        self.length += 1

    def prepend(self, val):
        '''add new value to beginning of LL.
        time: O(1) | space: O(1)'''
        new_node = ListNode(val, self.head)
        self.head = new_node
        if self.head is None:
            self.tail = new_node

        self.length += 1

    def pop(self):
        '''remove last element (tail) in LL.
        return removed node's value
        time: O(n) | space: O(1)'''
        if self.head is None:  # no tail or head
            raise Exception('No element to remove')
        prev = curr = self.head
        while curr and curr.next:
            prev = curr
            curr = curr.next
        # now we are on 2nd to last element
        self.tail = prev
        self.tail.next = None
        if self.head == self.tail:
            self.head = self.tail = None
        self.length -= 1
        return curr.val

    def popleft(self):
        '''remove first element (head) in LL.
        return removed node's value
        time: O(1) | space: O(1)'''
        if self.head is None:  # no tail or head
            raise Exception('No element to remove')
        old_head = self.head
        if self.head == self.tail:
            self.tail = None
        self.head = self.head.next
        self.length -= 1
        return old_head.val

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
        prev = curr = self.head
        for _ in range(i):
            prev = curr
            curr = curr.next
        prev.next = ListNode(v, curr)
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

        prev = curr = self.head
        for _ in range(i):
            prev = curr
            curr = curr.next
        prev.next = curr.next
        self.length -= 1
        return curr.val

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
        '''reverse a singly linked list.
        time: O(n) | space: O(1)'''
        if self.head == None:
            raise Exception('no nodes in LL')
        l, m, r = None, self.head, self.head.next
        while r:
            m.next = l
            l = m
            m = r
            r = m.next
        m.next = l
        self.head, self.tail = self.tail, self.head

    def print_out_ll(self):
        curr = self.head
        while curr:
            print(curr.val)
            curr = curr.next

# testing


def print_out_ll():
    global curr
    while curr:
        print(curr.val)
        curr = curr.next
    print('--------')


# l1 = SinglyLinkedList([1, 2, 3])
# curr = l1.head
# print_out_ll()


# l1.prepend(0)
# curr = l1.head
# print_out_ll()

# l1.pop()
# curr = l1.head
# print_out_ll()

# l2 = SinglyLinkedList([])
# l2.pop()

# l3 = SinglyLinkedList([1])
# l3.pop()
# curr = l3.head
# print_out_ll()

l4 = SinglyLinkedList([1, 2, 3])
l4.reverse_linked_list()
curr = l4.head
print_out_ll()

l5 = SinglyLinkedList([1, 2])
l5.reverse_linked_list()
curr = l5.head
print_out_ll()

l6 = SinglyLinkedList([1])
l6.reverse_linked_list()
curr = l6.head
print_out_ll()
