'use strict';

var _vorpal = require('vorpal');

var _vorpal2 = _interopRequireDefault(_vorpal);

var _inquirer = require('inquirer');

var _lib = require('./lib');

var _fs = require('fs');

var _jsverify = require('jsverify');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fs = require('fs');


const cli = (0, _vorpal2.default)();

const askForQuestions = [{
  type: 'input',
  name: 'numQuestions',
  message: 'How many questions do you want in your quiz?',
  validate: input => {
    const pass = input.match(/^[1-9]{1}$|^[1-9]{1}[0-9]{1}$|^100$/);
    return pass ? true : 'Please enter a valid number!';
  }
}, {
  type: 'input',
  name: 'numChoices',
  message: 'How many choices should each question have?',
  validate: input => {
    const pass = input.match(/^(?:[2-4]|0[2-4]|4)$/);
    return pass ? true : 'Please enter a valid number!';
  }
}];

const createQuiz = title => (0, _inquirer.prompt)(askForQuestions).then(answer => (0, _inquirer.prompt)((0, _lib.createPrompt)(answer)).then(quizdata => (0, _lib.writeFile)(title.fileName + '.json', quizdata))).catch(err => console.log('Error creating the quiz.', err));

const takeQuiz = (title, output) => {
  (0, _lib.readFile)(title).then(fileData => (0, _lib.createQuestions)(JSON.parse(fileData))).then(quizData => (0, _inquirer.prompt)(quizData)).then(answers => (0, _lib.writeFile)(output + '.json', answers)).catch(err => console.log('Error taking the quiz.', err));
};

const takeRandomQuiz = (quizzes, out) => {
  let randInt = Math.floor(Math.random() * quizzes.length);
  takeQuiz(quizzes[randInt] + '.json', out);
};

cli.command('create <fileName>', 'Creates a new quiz and saves it to the given fileName').action(function (input, callback) {
  return createQuiz(input);
});

cli.command('take <fileName> <outputFile>', 'Loads a quiz and saves the users answers to the given outputFile').action(function (input, callback) {
  return takeQuiz(input.fileName + '.json', input.outputFile);
});

cli.command('random <outputFile> <fileNames...>', 'Loads a quiz or' + ' multiple quizes and selects a random number of questions from each quiz.' + ' Then, saves the users answers to the given outputFile').action(function (input, callback) {
  // TODO implement the functionality for taking a random quiz
  return takeRandomQuiz(input.fileNames, input.outputFile);
});

cli.delimiter(cli.chalk['yellow']('quizler>')).show();