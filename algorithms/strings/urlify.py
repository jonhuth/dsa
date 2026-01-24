def urlify(s):
    '''
    write a method to replace all spaces in a string with '%20'.

    time: O(n) | space: O(n)
    worst case: string of n spaces => new string of 2*n chars ('%20' repeated n times)
    '''
    out = []
    for c in s:
        if c == ' ':
            out.append('%20')
        else:
            out.append(c)

    return ''.join(out)


print(urlify('best url'))
print(urlify('the best url'))
print(urlify('besturl'))
