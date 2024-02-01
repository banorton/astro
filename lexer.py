import re


def tokenize(contents):
    # split contents into tokens
    lines = contents.split("\n")

    tokens = []
    for line in lines:
        currtoken = line.split()

    return tokens


def parse(filename):
    contents = open(filename, "r").read()
    tokens = tokenize(contents)
    return tokens
