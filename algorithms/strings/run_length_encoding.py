def runLengthEncoding(string):
    # O(n) time | O(n) space
    out = []
    count = 1
    for i in range(1, len(string)):
        if string[i] != string[i-1] or count == 9:
            out.append(str(count) + string[i-1])
            count = 0
        count += 1
    # need to add last run upon completion of loop
    out.append(str(count) + string[-1])

    return ''.join(out)
