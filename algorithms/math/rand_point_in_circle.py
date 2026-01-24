import random


class Solution:

    def __init__(self, radius: float, x_center: float, y_center: float):
        self.radius = radius
        self.x_center = x_center
        self.y_center = y_center

    def randPoint(self) -> List[float]:
        '''
        eq. (x - x_center)**2 + (y - y_center)**2 <= radius**2
        include points on the circumference (use <= for inequality check)
        random.uniform(a,b)
        '''
        # boundaries of square enclosing circle
        x_lower, x_upper = self.x_center - self.radius, self.x_center + self.radius
        y_lower, y_upper = self.y_center - self.radius, self.y_center + self.radius

        while True:
            x_coord = random.uniform(x_lower, x_upper)
            y_coord = random.uniform(y_lower, y_upper)
            if (x_coord - self.x_center)**2 + (y_coord - self.y_center)**2 <= self.radius**2:
                return [x_coord, y_coord]


# Your Solution object will be instantiated and called as such:
# obj = Solution(radius, x_center, y_center)
# param_1 = obj.randPoint()
