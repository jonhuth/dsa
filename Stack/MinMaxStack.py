
class MinMaxStack:
    def __init__(self):
        self.stack = []  # [a, b, c, ...]
        self.minMaxStack = []  # [{'min': x, 'max': y}, ...]
        # [5]
        # [{'min': 5, 'max': 5}]

    def peek(self):
        return self.stack[-1]

    def pop(self):
        self.minMaxStack.pop()
        return self.stack.pop()

    def push(self, number):
        newMinMax = {'min': number, 'max': number}
        if self.minMaxStack:
            lastMinMax = self.minMaxStack[-1]
            newMinMax['min'] = min(lastMinMax['min'], number)
            newMinMax['max'] = max(lastMinMax['max'], number)
        self.stack.append(number)
        self.minMaxStack.append(newMinMax)

    def getMin(self):
        return self.minMaxStack[-1]['min']

    def getMax(self):
        return self.minMaxStack[-1]['max']
