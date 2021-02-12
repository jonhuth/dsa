from collections import defaultdict


def findDuplicate(paths):  # hint: think about group anagrams
    # time: O(n*l) | space: O(n*l) - n: number of strings, l: length of paths
    def clean_file(dir_path, file):
        file_split = file.split('(')
        file_name, content = file_split[0], file_split[1][:-1]
        return {'file_path': f'{dir_path}/{file_name}', 'content': content}

    dupe_groups = defaultdict(list)  # key:value = content:file_paths_list
    for path in paths:
        path_split = path.split(' ')
        dir_path, files = path_split[0], path_split[1:]
        for file in files:
            file_path, content = clean_file(dir_path, file).values()
            dupe_groups[content].append(file_path)

    return [dupe_groups[group] for group in dupe_groups
            if len(dupe_groups[group]) > 1]
