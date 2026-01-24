class Stack:
    '''
    Dynamic Array based implementation of Stack data structure
    '''

    def __init__(self):
        self.stack = []

    def is_empty(self):
        return not self.stack

    def peek(self):
        return self.stack[-1]

    def pop(self):
        return self.stack.pop()

    def push(self, number):
        self.stack.append(number)
