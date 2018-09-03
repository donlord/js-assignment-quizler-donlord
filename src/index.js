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

const createQuiz = title =>
  prompt(askForQuestions)
    .then(answer =>
      // TODO finish createQuiz logic

      writeFile(title.fileName + '.js', createPrompt(answer))
    )
    .catch(err => console.log('Error creating the quiz.', err))

const takeQuiz = (title, output) => {
  // TODO implement takeQuiz
  // readfile, create an object with questionx:answer , write that to output
  // let x = readFile(title.fileName + '.js')
  // x.then(answer => console.log(x))
}
// const takeRandomQuiz = (quizes, output, n) =>
// TODO implement takeRandomQuiz

cli
  .command(
    'create <fileName>',
    'Creates a new quiz and saves it to the given fileName'
  )
  .action(function (input, callback) {
    // TODO update create command for correct functionality
    return createQuiz(input)
  })

cli
  .command(
    'take <fileName> <outputFile>',
    'Loads a quiz and saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    // TODO implement functionality for taking a quiz
  })

cli
  .command(
    'random <outputFile> <fileNames...>',
    'Loads a quiz or' +
      ' multiple quizes and selects a random number of questions from each quiz.' +
      ' Then, saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    // TODO implement the functionality for taking a random quiz
  })

cli.delimiter(cli.chalk['yellow']('quizler>')).show()
