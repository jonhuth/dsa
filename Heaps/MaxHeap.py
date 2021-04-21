class MaxHeap:
    def __init__(self):
        self.heap = [None]  # heap starts at index 1

    def swim(self, k):
        '''
        sift up element at kth index up to restore heap invariant
        exchange with parent as long as parent is smaller.
        time: O(logn) | space: O(1)
        '''
        while k > 1 and self.heap[k//2] < self.heap[k]:
            self.heap[k//2], self.heap[k] = self.heap[k], self.heap[k//2]
            k = k // 2

    def sink(self, k):
        '''
        sift down element at kth index down to restore heap invariant
        exchange with max child as long as parent is smaller.
        time: O(logn) | space: O(1)
        '''
        n = self.size()
        while 2*k <= n:
            j = 2*k
            if j < n and self.heap[j] < self.heap[j+1]:
                j += 1
            # no need to sink down more; correct place
            if not (self.heap[k] < self.heap[j]):
                break
            self.heap[k], self.heap[j] = self.heap[j], self.heap[k]
            k = j

    def insert(self, v):
        self.heap.append(v)
        self.swim(self.size())

    def del_max(self):
        '''
        remove max key from max heap
        time: O(logn) | space: O(1)
        '''
        n = self.size()
        _max = self.heap[1]

        self.heap[1], self.heap[n] = self.heap[n], self.heap[1]
        self.heap.pop()

        self.sink(1)
        # self.heap.append(None) - using dynamic array, don't need
        return _max

    def is_empty(self):
        return len(self.heap) < 2

    def max(self):
        # time: O(1) | space: O(1)
        return self.heap[1]

    def size(self):
        return len(self.heap)
