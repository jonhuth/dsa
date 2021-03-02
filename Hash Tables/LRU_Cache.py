from collections import OrderedDict


class LRUCache(OrderedDict):
    # maintain FIFO order for OrderedDict since it stores keys
    # in insertion order (FIFO)
    # O(capacity) space - since we use a OrderedDict of capacity length
    def __init__(self, capacity: int):
        self.capacity = capacity if capacity >= 0 else 0

    def get(self, key: int) -> int:
        # O(1) time
        if key not in self:
            return - 1
        self.move_to_end(key)
        return self[key]

    def put(self, key: int, value: int) -> None:
        # O(1) time
        if key in self:
            self[key] = value
            self.move_to_end(key)
            return

        if len(self) < self.capacity:  # insert kvp no problem
            self[key] = value
        elif len(self) == self.capacity:  # evict least recently used key
            self.popitem(last=False)
            self[key] = value
