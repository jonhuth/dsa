from cmath import exp, pi


def fft(P):
    '''
    performs fast fourier transform on polynomial.
    f: coefficient representation => value representation of polynomial
    note: num of terms must be a power of 2
    P - [p0, p1, ..., pn-1]
    time: O(nlogn) | space: O(n)
    '''
    n = len(P)
    if n == 1:
        return P

    i = complex(0, 1)
    real = complex(2*pi/n, 0)
    omega = exp(real*i)
    P_e, P_o = P[::2], P[1::2]
    y_e, y_o = fft(P_e), fft(P_o)
    y = [0] * n
    for j in range(n//2):
        y[j] = y_e[j] + (omega**j)*y_o[j]
        y[j + n//2] = y_e[j] - (omega**j)*y_o[j]
    return y
