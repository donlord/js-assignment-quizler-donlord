// TODO copy your readFile, writeFile, chooseRandom, createPrompt, and createQuestions
// functions from your notes and assignments.
const fs = require('fs')
// TODO export your functions
export const chooseRandom = (array, numItems) => {
  if (array === undefined) {
    return []
  }
  if (array.length <= 2) {
    return array
  }
  if (numItems > array.length || numItems === undefined) {
    numItems = Math.floor(Math.random() * array.length)
  }
  let indexArray = []
  // Fill indexArray with random indices
  while (indexArray.length != numItems) {
    let randInt = Math.floor(Math.random() * array.length)
    if (indexArray.length === 0) {
      indexArray.push(randInt)
    }
    let inArray = false
    // check to see if randomInt is in the indexed array, if so continue else add it to the indexArray
    for (let i = 0; i < indexArray.length; i++) {
      if (indexArray[i] === randInt) {
        inArray = true
      }
    }
    if (inArray == false) {
      indexArray.push(randInt)
    }
  }
  // return the new array with the random values from indices indicated in indexArray
  let filteredArray = []
  for (let i = 0; i < indexArray.length; i++) {
    filteredArray.push(array[indexArray[i]])
  }
  return filteredArray
}

export const createPrompt = ({ numQuestions = 1, numChoices = 2 } = {}) => {
  let arrObjs = []
  for (let x = 0; x < numQuestions; x++) {
    let qObj = {}
    qObj['type'] = 'input'
    qObj['name'] = `question-${x + 1}`
    qObj['message'] = `Enter question ${x + 1}`
    arrObjs.push(qObj)
    for (let j = 0; j < numChoices; j++) {
      let aObj = {}
      aObj['type'] = 'input'
      aObj['name'] = `question-${x + 1}-choice-` + (j + 1)
      aObj['message'] = `Enter answer choice ${j + 1} for question ${x + 1}`
      arrObjs.push(aObj)
    }
  }
  return arrObjs
}

export const objMaker = (name, message, choices) => {
  return {
    type: 'list',
    name: name,
    message: message,
    choices: choices
  }
}

export const createQuestions = inputObject => {
  if (
    inputObject === {} ||
    typeof inputObject === 'undefined' ||
    Object.keys(inputObject).length === 0
  ) {
    return []
  }
  let inputArray = Object.entries(inputObject)

  let questions = []
  let keys = 'question-1'
  let choices = []
  let message = ''
  let name = ''

  for (let i = 0; i < inputArray.length; i++) {
    if (keys === inputArray[i][0]) {
      message = inputArray[i][1]
      //   name = inputArray[i][0]
      name = message
    } else if (inputArray[i][0].includes(keys)) {
      choices.push(inputArray[i][1])
    } else {
      let questionObj = objMaker(name, message, choices)
      questions.push(questionObj)
      choices = []
      message = inputArray[i][1]
      keys = inputArray[i][0]
      //   name = inputArray[i][0]
      name = message
    }
  }
  let questionObj = objMaker(name, message, choices)
  questions.push(questionObj)
  return questions
}
export const readFile = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

export const writeFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(data), err => {
      if (err) {
        reject(err)
      }
    })
  })
}
