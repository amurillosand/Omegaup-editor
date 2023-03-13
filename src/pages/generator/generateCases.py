from typing import NamedTuple
import shutil
import glob
import os
from sys import platform


class Code(NamedTuple):
    name: str
    file: str
    extension: str


def searchFile(filename):
    # Find all files: "filename.*"

    def valid(file):
        extension = os.path.splitext(file)[1]
        return len(extension) > 0 and not extension.endswith(".out")

    result = [file for file in glob.glob(f"{filename}.*") if valid(file)]

    if len(result) == 0:
        print(f"{filename} not found")
        exit()

    if len(result) > 1:
        print(
            f"There are {len(result)} files which match '{filename}.*', please change the name to something unique :)")
        exit()

    file = result[0]

    return Code(os.path.splitext(file)[0], file, os.path.splitext(file)[1])


def compileIfNeeded(code):
    if code.extension == ".cpp":
        os.system(f"g++ --std=c++17 {code.file} -o {code.name}.out")
    elif code.extension == ".java":
        print("No sé correr Java, arregle esto (línea 42 y 54)")
        os.system(f"javac {code.file}")


def run(code, inputFile, outputFile):
    if code.extension == ".cpp":
        if platform == "win32":
            os.system(f"{code.name}.out < {inputFile} > {outputFile}")
        else:
            os.system(f"./{code.name}.out < {inputFile} > {outputFile}")
    elif code.extension == ".py":
        os.system(f"python3 {code.file} < {inputFile} > {outputFile}")
    elif code.extension == ".java":
        os.system(f"java {code.name}")


def createFolder(folderName):
    if os.path.exists(folderName):
        shutil.rmtree(folderName)
    os.mkdir(folderName)
    return folderName


solution = searchFile("solutions/solution")
generator = searchFile("solutions/generator")

cases = createFolder("cases")

compileIfNeeded(solution)
compileIfNeeded(generator)

with open("testplan") as testPlan:
    for line in testPlan:
        line = line.split(" ")

        if line[0].find(".") == -1:
            line[0] = "sin_grupo." + line[0]

        groupTestCase = line[0].replace(".", " ")
        print(f"Generating {groupTestCase} ...")

        trash = open("trash", 'w')
        trash.write(f"{groupTestCase}")
        trash.close()

        if line[0].startswith("sin_grupo"):
            line[0] = line[0][10:]

        inputFile = f"cases/{line[0]}.in"
        outputFile = f"cases/{line[0]}.out"

        run(generator, "trash", inputFile)
        run(solution, inputFile, outputFile)
