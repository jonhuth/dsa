from cmath import exp, pi


def ifft(P):
    '''
    performs inverse fast fourier transform on polynomial.
    f: value representation => coefficient representation of polynomial
    note: num of evals must be a power of 2
    P - [P(o**0), P(omega**1), ..., P(omega**(n-1))]
    time: O(nlogn) | space: O(n)
    '''
    n = len(P)
    if n == 1:
        return P

    i = complex(0, 1)
    real = complex(2*pi/n, 0)
    omega = (1/n)*exp(-2*real*i)
    P_e, P_o = P[::2], P[1::2]
    y_e, y_o = ifft(P_e), ifft(P_o)
    y = [0] * n
    for j in range(n//2):
        y[j] = y_e[j] + (omega**j)*y_o[j]
        y[j + n//2] = y_e[j] - (omega**j)*y_o[j]
    return y
