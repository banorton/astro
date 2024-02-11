class Token:
    types = [
        "Number",
        "Identifier",
        "Equal",
        "OpenParen",
        "CloseParen",
        "BinaryOperator",
        "Keyword",
    ]
    keywords = ["set", "for", "func"]

    def __init__(self, value, type):
        self.value = value
        self.type = type

    def __repr__(self):
        # return "(" + str(self.type) + ":" + str(self.value) + ")"
        return str(self.type) + ":" + str(self.value)

def tokenize(contents):
    # split contents into tokens
    lines = contents.split("\n")

    tokens = []
    for line in lines:
        line = list(line)
        while line:
            # Handles parenthesis and binary operators
            if line[0] == "(":
                tokens.append(Token(line.pop(0), Token.types.index("OpenParen")))
            elif line[0] == ")":
                tokens.append(Token(line.pop(0), Token.types.index("CloseParen")))
            elif line[0] == "=":
                tokens.append(Token(line.pop(0), Token.types.index("Equal")))
            elif line[0] in "+-/*":
                tokens.append(Token(line.pop(0), Token.types.index("BinaryOperator")))

            # Handle keywords and strings
            elif line[0].isalpha():
                string = []
                while line and line[0].isalpha():
                    string.append(line.pop(0))
                string = "".join(string)
                # Check for keywords
                if string in Token.keywords:
                    tokens.append(Token(string, Token.types.index("Keyword")))
                else:
                    tokens.append(Token(string, Token.types.index("Identifier")))

            # Handle numbers
            elif line[0].isnumeric():
                number = []
                while line and line[0].isnumeric():
                    number.append(line.pop(0))
                number = "".join(number)
                tokens.append(Token(number, Token.types.index("Number")))

            else:
                line.pop(0)
    return tokens


def parse(filename):
    source = open(filename, "r").read()
    tokens = tokenize(source)
    return tokens
