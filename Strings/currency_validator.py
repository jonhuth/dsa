import re


def currency_validator(s):
    '''
    given string, check if it is a valid currency or not.

    $1,000,000 => True
    $1,000.22 => True
    $0.22 => True
    $10,00,000 => False
    $1,000. => False
    !1,200 => False

    currency components:
    1. can be negative or positive (- or () to represent negative nums)
    2. valid prefix symbol (check against set)
    3. up to 2 decimal places
    4. correct comma placement (if necessary) 
    '''

    symbols = {'€', '£', '$', '¥'}
    return valid_prefix(s, symbols) and valid_decimals(s, symbols) and valid_commas(s, symbols)


def valid_prefix(s, symbols):
    negative_flag = False
    if s[0] == '-':
        negative_flag = True
    elif s[0] == '(':
        if s[-1] == ')':
            negative_flag = True
    return (negative_flag and s[1] in symbols) or s[0] in symbols


def valid_decimals(s, symbols):
    if '.' not in s:  # nothing to check, must check valid commas next
        return True
    if s.count('.') > 1:
        return False
    # remove any '-', '(', ')', curr symbols
    s_trimmed = re.sub('[-()' + ''.join(symbols) + ']', '', s)
    after_decimal = s_trimmed.split('.')[1]   # get digits after decimal
    non_digits = re.findall(r'\D', after_decimal)
    if len(after_decimal) not in [1, 2] or len(non_digits) != 0:
        return False
    return True


def valid_commas(s, symbols):
    # remove any '-', '(', ')', curr symbols, '.'
    s_trimmed = re.sub('[-()' + ''.join(symbols) + ']', '', s)
    # remove digits after decimal and decimal itself
    if '.' in s_trimmed:
        decimal_idx = s_trimmed.index('.')
        s_trimmed = s_trimmed[0:decimal_idx]
    groupings = s_trimmed.split(',')  # [xxx, yyy, zzz]
    if len(groupings[0]) == 0:
        return False
    for i in range(1, len(groupings)):
        non_digits = re.findall(r'\D', groupings[i])
        if len(groupings[i]) != 3 or len(non_digits) != 0:
            return False
    return True


print(f'{currency_validator("$1,000,000")} should equal True')
print(f'{currency_validator("$1,000.22")} should equal True')
print(f'{currency_validator("$0.22")} should equal True')
print(f'{currency_validator("$10,00,000")} should equal False')
print(f'{currency_validator("$1,000.")} should equal False')
print(f'{currency_validator("!1,200")} should equal False')
print(f'{currency_validator("$1,,200")} should equal False')
print(f'{currency_validator("$1,2ab.09")} should equal False')
