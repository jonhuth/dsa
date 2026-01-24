from collections import deque
from collections import defaultdict
def currencyConversion(rates, F, T) -> float:
    '''
    algorithm:
    1. build hash-map/graph of form: from -> toCurrencies[(to, rate)] (ex. USD:
    [(GBP, x], (JPY, z), ...])
    2. do a bfs from the fromCurrency looking for the toCurrency (this will find
    the soln. w/ the smallest num of transactions)
    3. if found return cumulative rate along the path
    4. else return -1
    '''
    h = defaultdict(list)
    for f, t, r in rates:
        h[f].append((t, r))
        h[t].append((f, 1/r)) # bi-directional
    
    # (from, currRate)
    q = deque([(F, 1)]) # anything multiplied by 1 is itself
    visited = set()
    while q:
        f, currRate = q.popleft()
        if f == T:
            return currRate
        visited.add(f)
        for t, r in h[f]:
            if t not in visited:
                q.append((t, currRate*r))
            
    return -1


rates0 = [['USD', 'JPY', 110], ['USD', 'AUD', 1.45], ['JPY', 'GBP', 0.0070]]
f0, t0 = 'AUD', 'GBP'

print(currencyConversion(rates0, f0, t0))

rates1 = [
    ['a', 'b', 2.5], ['a', 'c', 1.75], ['a', 'e', .5], 
    ['c', 'e', 1.1],
    ['b', 'd', 10], 
    ['d', 'e', .6]
]
f1, t1 = 'c', 'd'
print(currencyConversion(rates1, f1, t1))