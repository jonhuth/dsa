def caesarCipherEncryptor(string, key):
    # time: O(n) | space: O(n) - for output string
    new_str = ''

    # keys: numbers
    # values: letters (lowercase only)
    for char in string:
        code = ((ord(char) - 97 + key) % 26) + 97
        new_str += chr(code)

    return new_str
