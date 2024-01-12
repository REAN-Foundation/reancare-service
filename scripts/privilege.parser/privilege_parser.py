
import json
import os
import fnmatch
import re

############################################################################

# Define the directory where you want to start searching
start_dir = os.path.abspath('./src')
output_file = os.path.abspath('./seed.data/privileges_master.json')

############################################################################

# Define the substrings to search for
start_substring = ", auth("
end_substring = "), "

# Define a regular expression pattern for the search
pattern = re.compile(fr'{re.escape(start_substring)}(.*?){re.escape(end_substring)}', re.DOTALL)

# Create a list to store the matching lines
matching_lines = []

# Iterate through files in the directory and subdirectories
for root, dirs, files in os.walk(start_dir):
    for filename in fnmatch.filter(files, '*.routes.ts'):
        filepath = os.path.join(root, filename)
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            matches = pattern.findall(content)
            if matches:
                matches = [match.strip() for match in matches]
                matches = [match.replace(', true', '') for match in matches]
                matches = [match.replace(' ', '') for match in matches]
                matches = [match.replace('\'', '') for match in matches]
                matches = list(filter(lambda x: x != "", matches))
                matching_lines.extend(matches)

matching_lines = sorted(set(matching_lines))
privilege_list_str = json.dumps(matching_lines, indent=4)
with open(output_file, 'w', encoding='utf-8') as file:
    file.write(privilege_list_str)

############################################################################

# def convert_to_json(string_list):
#     json_hierarchy = {}

#     # Process each string in the list
#     for string in string_list:
#         parts = string.split('.')  # Split the string by the '.' separator

#         # Create a reference to the current position in the JSON hierarchy
#         current_level = json_hierarchy

#         for part in parts:
#             # Check if the part is already a key in the current level
#             if part not in current_level:
#                 # If not, create it as an empty dictionary
#                 current_level[part] = {}

#             # Move the reference to the next level
#             current_level = current_level[part]

#     # Convert the JSON hierarchy to a JSON string
#     json_string = json.dumps(json_hierarchy, indent=4)
#     return json_string, json_hierarchy

# json_string, json_hierarchy = convert_to_json(matching_lines)
# print(f"Matching lines written to {output_file}")

# output_file = 'output.json'
# with open(output_file, 'w', encoding='utf-8') as file:
#     file.write(json_string)
