class Token:
    def __init__(self, value, type):
        self.value = value
        self.type = type

    def __repr__(self):
        return "(" + str(self.type) + ":" + str(self.value) + ")"

    def types():
        return [
            "Number",
            "Identifier",
            "Equal",
            "OpenParen",
            "CloseParen",
            "BinaryOperator",
            "Set",
        ]


def tokenize(contents):
    # split contents into tokens
    lines = contents.split("\n")

    tokens = []
    for line in lines:
        line = list(line)
        for char in line:
            if char == "(":
                tokens.append(Token(char, Token.types().index("OpenParen")))
            elif char == ")":
                tokens.append(Token(char, Token.types().index("CloseParen")))
            elif char == "=":
                tokens.append(Token(char, Token.types().index("Equal")))
            elif char in "+-/*":
                tokens.append(Token(char, Token.types().index("BinaryOperator")))

    return tokens


def parse(filename):
    source = open(filename, "r").read()
    tokens = tokenize(source)
    return tokens
