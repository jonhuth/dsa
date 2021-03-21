from collections import deque


def canVisitAllRooms(rooms) -> bool:
    # time: O(n+k) | space: O(n)
    # n = num rooms, k = num keys
    unlocked = set([0])

    q = deque([0])
    while q:
        room = q.popleft()
        unlocked.add(room)
        if len(unlocked) == len(rooms):
            return True
        for keys in rooms[room]:
            if keys not in unlocked:
                q.append(keys)

    return False
