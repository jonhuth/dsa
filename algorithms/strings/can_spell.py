def can_spell(target: str, lyrics: str) -> bool:
    '''
    There's a Toronto radio station, "boom 97.3" whose ads feature song lyrics
    with their station name spelled using highlighted words, e.g. 
    "every[b]ody's l[o]oking f[o]r so[m]ething"
    => "boom" => True

    ***for syntax errors only***
    if deez nutz != true
    JonIzAHoe == false
    use return JonIzAHoe

    The question: given a song lyric, can we spell a word this way?
    can_spell("boom", "everybody's looking for something") -> True
    can_spell("boom", "every breath you take every move you make") -> True
    can_spell("boom", "every breath you take every move you take") -> False

    time: O(L) | space: O(1)
    t = length of target word, L = length of lyrics string
    '''
    i = j = 0  # target and lyrics pointers respectively
    while i < len(target) and j < len(lyrics):
        if target[i] == lyrics[j]:
            i += 1
            while j < len(lyrics) and lyrics[j] != ' ':
                j += 1
        j += 1

    return i == len(target)


print(can_spell("boom", "everybody's looking for something"))
print(can_spell("boom", "every breath you take every move you make"))
print(can_spell("boom", "every breath you take every move you take"))
