
import os

def find_file(name, path):
    for root, dirs, files in os.walk(path):
        if name in files:
            print(os.path.join(root, name))

if __name__ == "__main__":
    find_file("page.tsx", ".")
