import sys

name = "Wojciech"
album = "57780"
version = sys.version.split()[0]
location = sys.executable

print(f"Hello {name} ({album}). This environment is using Python version {version} at location {location}.")
