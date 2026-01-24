class HashTableLinearProbing:
    '''
    linear probing implementation of hash table.
    in case of hash collision, look to the right and worst wrap around array
    to find next open slot in hash table.

    arr doubling and halving code omitted
    '''

    def __init__(self):
        # n = num of keys, m = num of slots in hash table
        self.M = 30001  # num slots in hash table
        self.keys = [None] * self.M   # array of keys
        self.vals = [None] * self.M   # array of values

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

        time: avg: O(1) worst case: O(m) | space: O(1)
        where m = num slots in hash table
        '''
        idx = self.hash(key)
        for i in range(idx, self.M):  # [idx, M)
            if self.keys[i] == key:
                return self.vals[i]
        for i in range(0, idx):  # [0, idx)
            if self.keys[i] == key:
                return self.vals[i]
        return None

    def put(self, key, val):
        '''
        put kvp in hash table.
        if key already in hash table, update val.
        if another key already hashed to same index,
        keep looking to right until open slot to put.
        if reach end, wrap back around to start
        and look right until reaching hash idx.

        time: avg: O(1) worst case: O(m) | space: O(1)
        where m = num slots in hash table
        '''
        idx = self.hash(key)
        for i in range(idx, self.M):
            if self.keys[i] is None:
                self.keys[i] = key
            if self.keys[i] == key:
                self.vals[i] = val
                return
        for i in range(0, idx):
            if self.keys[i] is None:
                self.keys[i] = key
            if self.keys[i] == key:
                self.vals[i] = val
                return
