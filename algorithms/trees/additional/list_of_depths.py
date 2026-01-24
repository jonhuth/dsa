
import sys
import os
sys.path.append(os.path.normpath(os.path.join(
    os.path.dirname(os.path.abspath(__file__)), '..', 'LinkedLists')))
import SinglyLinkedList as pkg


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def list_of_depths(root: TreeNode):
    '''
    Given a binary tree, design an algorithm which creates a linked list of all
    thhe nodes at each depth (e.g., if you have a tree with depth D, you'll
    have D linked lists)

    time: O(n) | space: O(n) - size for return arr of LLs
    '''
    def list_of_depths_helper(root, depth=0, level=[]):
        if root:
            if depth >= len(level):
                level.append(pkg.SinglyLinkedList([root.val]))  # add new LL for new depth
            else:
                level[depth].append(root.val)  # append to existing LL
        if root.left:
            list_of_depths_helper(root.left, depth+1, level)
        if root.right:
            list_of_depths_helper(root.right, depth+1, level)
        return level
    return list_of_depths_helper(root)


tree = TreeNode(3, TreeNode(2, TreeNode(12), TreeNode(15)),
                TreeNode(9, TreeNode(18), TreeNode(27)))
levels = list_of_depths(tree)
for i, LL in enumerate(levels):
    print(f'depth={i}')
    LL.print_out_ll()
