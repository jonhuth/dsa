from collections import deque


def get_currency_rate(from_curr, to_currency, curr_rates):
    '''
    given an array of currency rates, convert from curr -> to curr if possible.
    else return None.
    assumptions:
    1. from in curr_rates
    2. to might not be in curr_rates
    notes:
    1. return None if conversion not possible
    2. can be multi step conversion: from: usd to: cny
    => usd -> jpy -> eur -> cny
    3. can model using a bi-directional graph (usd -> eur => eur -> usd)

    time: O(c+p) | space: O(p)
    where c = num of unique currencies (num vertices) 
    & p = num of curr pairs (num edges)
    '''
    convert_tbl = {}  # from -> to, rate
    for curr_rate in curr_rates:
        # usd -> jpy & usd -> cny
        f, t, rate = curr_rate
        if f in convert_tbl:
            convert_tbl[f].append({'to': t, 'rate': rate})
        else:
            convert_tbl[f] = [{'to': t, 'rate': rate}]
        if t in convert_tbl:
            convert_tbl[t].append({'to': f, 'rate': 1/rate})
        else:
            convert_tbl[t] = [{'to': f, 'rate': 1/rate}]

    to_visit = deque([(from_curr, 1)])
    visited = set()
    while to_visit:
        curr_from, potential_ans = to_visit.popleft()
        visited.add(curr_from)
        pairs = convert_tbl[curr_from]
        # check if we have curr -> to
        for pair in pairs:
            curr_to, rate = pair['to'], pair['rate']
            if curr_to not in visited:
                if curr_to == to_currency:
                    return potential_ans * rate
                to_visit.append((curr_to, potential_ans * rate))

    return None


rates = [["USD", "JPY", 110], ["JPY", "EUR", 0.01],
         ["EUR", "CNY", 9], ["MXD", "CAD", 0.7]]
print(f"{get_currency_rate('USD', 'EUR', rates)} should ~ equal 1.1")
print(f"{get_currency_rate('USD', 'CNY', rates)} should ~ equal 9.9")
print(f"{get_currency_rate('EUR', 'USD', rates)} should ~ equal 0.909090909")
print(f"{get_currency_rate('EUR', 'CHF', rates)} should equal None") # no CHF
print(f"{get_currency_rate('MXD', 'USD', rates)} should equal None") # no path between MXD and USD
