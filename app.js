const rq = require('request-promise')
const chalk = require('chalk')
const prompt = require('inquirer').prompt
const print = {
  log: text => console.log(chalk.greenBright(text)),
  warn: text => console.log(chalk.bold.red(text))
}
const argv = require('yargs').argv
const url = 'https://play.google.com/store/apps/details?id='
const proxy = 'http://127.0.0.1:7890'

function to(promise) {
  return promise
    .then(data => {
      return [null, data]
    })
    .catch(err => [err])
}
// const bundleId = 'com.beautycam.superlikes'
const id = argv.id
// 主函数
async function main(id) {
  console.log('please Wait a moment\n')
  const [err, res] = await to(rq.get(`${url}${id}`, {
    proxy
  }))
  if (res) {
    print.log('*** Your App is onLine ***')
  } else if (err && err.statusCode === 404) {
    print.warn('*** Your App is offLine ***')
  } else {
    print.log('*** You app is unknown,please check on browser: ' + `${url}${id}`)
  }
  process.exit(0)
}
// 显示逻辑
if (!id || id.length === 0) {
  print.warn('need input id')
  prompt([{
    type: 'input',
    name: 'id',
    message: 'what\'s your bundle id of app?'
  }])
  .then( answer => {
    main(answer.id)
  })
} else {
  main(id)
}
