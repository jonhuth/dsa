from collections import defaultdict


def tournamentWinner(competitions, results):
    # n teams => n(n-1)/2 | competitions = k comps & results
    # linear in # of comps; quadritc  in num of teams
    # time: O(n^2) | O(n) - where n is num of teams
    teamWins = defaultdict(int)
    bestTeam, bestWins = '', 0
    for i in range(len(competitions)):
        competition, result = competitions[i], results[i]
        homeTeam, awayTeam = competition[0], competition[1]

        winningTeam = homeTeam if result else awayTeam
        teamWins[winningTeam] += 1
        if teamWins[winningTeam] > bestWins:
            bestTeam = winningTeam
            bestWins = teamWins[winningTeam]

    return bestTeam


input1 = {
    "competitions": [
        ["HTML", "C#"],
        ["C#", "Python"],
        ["Python", "HTML"]
    ],
    "results": [0, 0, 1]
}
input2 = {
    "competitions": [
        ["HTML", "Java"],
        ["Java", "Python"],
        ["Python", "HTML"]
    ],
    "results": [0, 1, 1]
}

print(tournamentWinner(**input1))
print(tournamentWinner(**input2))
