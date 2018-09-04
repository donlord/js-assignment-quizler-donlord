import vorpal from 'vorpal'
import { prompt } from 'inquirer'
const fs = require('fs')
import {
  readFile,
  writeFile,
  chooseRandom,
  createPrompt,
  createQuestions
} from './lib'
import { write } from 'fs'
import { json } from 'jsverify'

const cli = vorpal()

const askForQuestions = [
  {
    type: 'input',
    name: 'numQuestions',
    message: 'How many questions do you want in your quiz?',
    validate: input => {
      const pass = input.match(/^[1-9]{1}$|^[1-9]{1}[0-9]{1}$|^100$/)
      return pass ? true : 'Please enter a valid number!'
    }
  },
  {
    type: 'input',
    name: 'numChoices',
    message: 'How many choices should each question have?',
    validate: input => {
      const pass = input.match(/^(?:[2-4]|0[2-4]|4)$/)
      return pass ? true : 'Please enter a valid number!'
    }
  }
]

/*
createQuiz takes one param: a filename. The user is displayed a prompt and
the answers are in an array (answer), which is written to a file.
*/
const createQuiz = title =>
  prompt(askForQuestions)
    .then(answer =>
      prompt(createPrompt(answer)).then(quizdata =>
        writeFile(title.fileName + '.json', quizdata)
      )
    )
    .catch(err => console.log('Error creating the quiz.', err))

/*
takeQuiz takes two params: a input filename and an output filename. takeQuiz
reads the input file and parses the data. The user is then displayed the questions
from the input file and the user's answers are written to the output file
*/

const takeQuiz = (title, output) => {
  readFile(title)
    .then(fileData => createQuestions(JSON.parse(fileData)))
    .then(quizData => prompt(quizData))
    .then(answers => writeFile(output + '.json', answers))
    .catch(err => console.log('Error taking the quiz.', err))
}

/*
takeRandomQuiz takes two params: a list of input file names and an output file
name. This function picks a random input file from the list given and then calls
takeQuiz on the random input file.
*/

const takeRandomQuiz = (quizzes, out) => {
  let randInt = Math.floor(Math.random() * quizzes.length)
  takeQuiz(quizzes[randInt] + '.json', out)
}

cli
  .command(
    'create <fileName>',
    'Creates a new quiz and saves it to the given fileName'
  )
  .action(function (input, callback) {
    return createQuiz(input)
  })

cli
  .command(
    'take <fileName> <outputFile>',
    'Loads a quiz and saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    return takeQuiz(input.fileName + '.json', input.outputFile)
  })

cli
  .command(
    'random <outputFile> <fileNames...>',
    'Loads a quiz or' +
      ' multiple quizes and selects a random number of questions from each quiz.' +
      ' Then, saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    return takeRandomQuiz(input.fileNames, input.outputFile)
  })

cli.delimiter(cli.chalk['yellow']('quizler>')).show()
