class DynamicArray(object):
    def __init__(self):
        self.size = 0
        self.capacity = 1
        self.array = self._create_array(self.capacity)

    def __len__(self):
        '''
        usage: len(array) - return current length of array
        '''
        return self.size

    def __getitem__(self, index):
        '''
        usage: array[index]: returns the element at the given index in the array
        '''
        if not (0 <= index < self.size):  # if not in bounds of array
            raise IndexError(
                f'Given index: {index} is larger than array size {self.size}')

        return self.array[index]

    def _create_array(self, capacity):
        '''
        create an array of given capacity
        '''
        return [None] * capacity

    def _resize(self, new_capacity):
        '''
        create new array with new capacity
        steps
        1. create new array with new capacity
        2. copy over old elements to new array
        3. reassign internal array
        '''
        new_array = self._create_array(new_capacity)

        for i in range(self.size):
            new_array[i] = self.array[i]

        self.array = new_array
        self.capacity = new_capacity

    def append(self, element):
        '''
        add a new element at end of array
        if array at capacity, create new array with double capacity
        time: worst case: O(n), amortized worst case: O(1)
        amortized over all appends (only O(n) when doubling)
        '''
        if self.size == self.capacity:
            self._resize(2 * self.capacity)

        self.array[self.size] = element
        self.size += 1

    def pop(self):
        '''
        pop last element from end of array
        '''
        element = None

        if self.size > 0:
            element = self.array[self.size - 1]
            self.array[self.size - 1] = None
            self.size -= 1

            if self.size < self.capacity // 4:
                self._resize(self.capacity // 2)

        return element
