
def intToRoman(num: int) -> str:
    '''
        num is in range [1, 3999]
        time: O(1) | space: O(1)
        as there are constant num of digits in num and value, roman_symbol pairs
    '''
    digits = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"),
              (90, "XC"), (50, "L"), (40, "XL"), (10, "X"), (9, "IX"),
              (5, "V"), (4, "IV"), (1, "I")]
    roman_num = ''
    for val, roman_symbol in digits:
        if num == 0:
            break

        count, num = num // val, num % val  # 1, 994
        roman_num += roman_symbol * count

    return roman_num
