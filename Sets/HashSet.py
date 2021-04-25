class Node:
    def __init__(self, key=None, next=None) -> None:
        self.key = key
        self.next = next


class HashSet:
    '''
    separate chaining implementation of hash set.
    like hash table but no reference to values.
    each. ele in hash set corresponds to Linked List

    arr doubling and halving code omitted
    '''

    def __init__(self):
        # n = num of keys, m = num of slots in hash set
        self.M = 97  # num slots in hash set
        self.hs = [None] * self.M   # array of linked lists

    def hash(self, key):
        '''
        hash a key using a variation of python hashing function.
        mod M since there are only M slots in the hash set

        time: avg: O(1) worst case: O(k) | space: O(1)
        where k = len of key
        '''
        return (hash(key) and 0x7fffffff) % self.M

    def get(self, key):
        '''
        get key in hash set, if not in hash set, return None

        time: avg: O(1) worst case: O(i) | space: O(1)
        where i = num nodes in ith linked list
        '''
        i = self.hash(key)
        curr = self.hs[i]
        while curr:
            if curr.key == key:
                return curr.key
            curr = curr.next
        return None

    def put(self, key):
        '''
        put key in hash set.
        if key already in hash set, do nothing.
        if another key already hashed to same index,
        make new key node head of LL.

        time: avg: O(1) worst case: O(i) | space: O(1)
        where i = num nodes in ith linked list
        '''
        i = self.hash(key)
        self.hs[i] = Node(key, self.hs[i])
