from operator import itemgetter  # faster than lambda method for sorting on keys

def convex_hull(points):
    '''
    points: arr of tuples where t[0] is x-coord, and t[1] is y-coord
    return the subset of points that form the convex hull for the points

    time: O(nlogn) | space: O(n) ??
    '''

    hull = []
    # get point w/ lowest y coord and lowest x to break ties
    p0 = get_p0(points)

    # sort by polar angle w/ p0
    
    points.sort(key=lambda p: polar)

    return hull


def get_p0(points):
    p0 = points[0]
    for point in points:
        x_coord, y_coord = point
        if y_coord < p0[1]:
            p0 = point
        elif y_coord == p0[1] and x_coord < p0[0]:
            p0 = point

    return p0


def p0_polar_angle_comparator(p1, p2):
    if arctan(p1[1], p1[0]) < arctan(p2[1], p2[0]):
        return -1
    elif arctan(p1[1], p1[0]) > arctan(p2[1], p2[0]):
        return 1
    return 0
