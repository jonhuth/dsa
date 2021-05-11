class Node:

    # Constructor to create a new node
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.parent = None

# A binary search tree


class BinarySearchTree:

    # Constructor to create a new BST
    def __init__(self):
        self.root = None

    def find_in_order_successor(self, inputNode):
        # the smallest node above the inputNode is the leftmost node in the right subtree else traverse up to root of whole tree and check
        # time: O(logn) for balanced tree O(n) for unbalanced tree | space: O(1)
        leftBound, rightBound = inputNode.key, float('inf')
        node = inputNode.right
        successor = node

        while node:
            if leftBound < node.key < rightBound:
                rightBound, successor = node.key, node
            node = node.left

        if rightBound < float('inf'):
            return successor

        node = inputNode
        successor = node
        while node:
            if leftBound < node.key < rightBound:
                rightBound, successor = node.key, node
            node = node.parent
        return successor if rightBound != float('inf') else None

    # Given a binary search tree and a number, inserts a
    # new node with the given number in the correct place
    # in the tree. Returns the new root pointer which the
    # caller should then use(the standard trick to avoid
    # using reference parameters)

    def insert(self, key):

        # 1) If tree is empty, create the root
        if (self.root is None):
            self.root = Node(key)
            return

        # 2) Otherwise, create a node with the key
        #    and traverse down the tree to find where to
        #    to insert the new node
        currentNode = self.root
        newNode = Node(key)
        while(currentNode is not None):

            if(key < currentNode.key):
                if(currentNode.left is None):
                    currentNode.left = newNode
                    newNode.parent = currentNode
                    break
                else:
                    currentNode = currentNode.left
            else:
                if(currentNode.right is None):
                    currentNode.right = newNode
                    newNode.parent = currentNode
                    break
                else:
                    currentNode = currentNode.right

    # Return a reference to a node in the BST by its key.
    # Use this method when you need a node to test your
    # findInOrderSuccessor function on
    def getNodeByKey(self, key):

        currentNode = self.root
        while(currentNode is not None):
            if(key == currentNode.key):
                return currentNode

            if(key < currentNode.key):
                currentNode = currentNode.left
            else:
                currentNode = currentNode.right

        return None

# Create a Binary Search Tree
bst = BinarySearchTree()
bst.insert(20)
bst.insert(9)
bst.insert(25)
bst.insert(5)
bst.insert(12)
bst.insert(11)
bst.insert(14)

# Get a reference to the node whose key is 9
test = bst.getNodeByKey(9)

# Find the in order successor of test
succ = bst.find_in_order_successor(test)

# Print the key of the successor node
if succ is not None:
    print("\nInorder Successor of %d is %d "
          % (test.key, succ.key))
else:
    print("\nInorder Successor doesn't exist")
