class DirectedEdge:
    '''
    class representation of weighted edge in a edge weighted digraph.
    '''

    def __init__(self, v, w, weight) -> None:
        self.v = v
        self.w = w
        self.weight = weight

    def from(self) -> int:
        return self.v

    def to(self) -> int:
        return self.w

    def get_weight(self) -> int:
        return self.weight
