class Node:
    def __init__(self, key=None, val=None, next=None) -> None:
        self.key = key
        self.val = val
        self.next = next


class SeparateChainingHashTable:
    '''
    separate chaining implementation of hash table.
    each. ele in hash table corresponds to Linked List

    arr doubling and halving code omitted
    '''

    def __init__(self):
        # n = num of keys, m = num of slots in hash table
        self.M = 97  # num slots in hash table
        self.ht = [None] * self.M   # array of linked lists

    def hash(self, key):
        '''
        hash a key using a variation of python hashing function.
        mod M since there are only M slots in the hash table

        time: avg: O(1) worst case: O(k) | space: O(1)
        where k = len of key
        '''
        return (hash(key) and 0x7fffffff) % self.M

    def get(self, key):
        '''
        get val corresponding to key in hash table.
        if key not in hash table, return None

        time: avg: O(1) worst case: O(i) | space: O(1)
        where i = num nodes in ith linked list
        '''
        i = self.hash(key)
        curr = self.ht[i]
        while curr:
            if curr.key == key:
                return curr.val
            curr = curr.next
        return None

    def put(self, key, val):
        '''
        put kvp in hash table.
        if key already in hash table, update val.
        if another key already hashed to same index,
        make new kvp node head of LL.

        time: avg: O(1) worst case: O(i) | space: O(1)
        where i = num nodes in ith linked list
        '''
        i = self.hash(key)
        curr = self.ht[i]
        while curr:
            if curr.key == key:
                curr.val = val
            curr = curr.next
        self.ht[i] = Node(key, val, self.ht[i])
