#!/usr/bin/env node

'use strict';
const program = require('commander');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
 
const log = console.log;
 
program
  // 定义 g 命令
  .command('g')
  // 命令 g 的描述
  .description('Generate a component')
  // 定义 -c 选项，接受一个必选参数 componentName：组件名称
  .option('-c, --component-name &lt;componentName&gt;', 'The name of the component')
  // 定义 --no-folder 选项：表示当使用该选项时，组件不会被文件夹包裹
  .option('--no-folder', 'Whether the component have not it is own folder')
  // 定义 -p 选项：表示当使用该选项时，组件为继承自 React.PureComponent 的类组件
  .option(
    '-p, --pure-component',
    'Whether the component is a extend from PureComponent'
  )
  // 定义 -s 选项：表示当使用该选项时，组件为无状态的函数组件
  .option(
    '-s, --stateless',
    'Whether the component is a extend from PureComponent'
  )
  // 定义执行 g 命令后调用的回调函数
  .action(function(cmd) {
    // 当 -c 选项没有传参数进来时，报错、退出
    if (!cmd.componentName) {
      log(chalk.red('error: missing required argument `componentName`'));
      process.exit(1);
    }
    // 创建组件
    createComponent(
      cmd.componentName,
      cmd.folder,
      cmd.stateless,
      cmd.pureComponent
    );
  });
 
program.parse(process.argv);
 
/**
 * 创建组件
 * @param {string} componentName 组件名称
 * @param {boolean} hasFolder 是否含有文件夹
 * @param {boolean} isStateless 是否是无状态组件
 * @param {boolean} isPureComponent 是否是纯组件
 */
function createComponent(
  componentName,
  hasFolder,
  isStateless = false,
  isPureComponent = false
) {
  let dirPath = path.join(process.cwd());
  // 组件在文件夹中
  if (hasFolder) {
    dirPath = path.join(dirPath, componentName);
 
    const result = fs.ensureDirSync(dirPath);
    // 目录已存在
    if (!result) {
      log(chalk.red(`${dirPath} already exists`));
      process.exit(1);
    }
    const indexJs = getIndexJs(componentName);
    const css = '';
    fs.writeFileSync(path.join(dirPath, `index.js`), indexJs);
    fs.writeFileSync(path.join(dirPath, `${componentName}.css`), css);
  }
  let component;
  // 无状态组件
  if (isStateless) {
    component = getStatelessComponent(componentName, hasFolder);
  } else {
    // 有状态组件
    component = getClassComponent(
      componentName,
      isPureComponent ? 'React.PureComponent' : 'React.Component',
      hasFolder
    );
  }
 
  fs.writeFileSync(path.join(dirPath, `${componentName}.js`), component);
  log(
    chalk.green(`The ${componentName} component was successfully generated!`)
  );
  process.exit(1);
}
 
/**
 * 获取类组件字符串
 * @param {string} componentName 组件名称
 * @param {string} extendFrom 继承自：'React.Component' | 'React.PureComponent'
 * @param {boolean} hasFolder 组件是否在文件夹中（在文件夹中的话，就会自动加载 css 文件）
 */
function getClassComponent(componentName, extendFrom, hasFolder) {
  return '省略...';
}
 
/**
 * 获取无状态组件字符串
 * @param {string} componentName 组件名称
 * @param {boolean} hasFolder 组件是否在文件夹中（在文件夹中的话，就会自动加载 css 文件）
 */
function getStatelessComponent(componentName, hasFolder) {
  return '省略...';
}
 
/**
 * 获取 index.js 文件内容
 * @param {string} componentName 组件名称
 */
function getIndexJs(componentName) {
  return `import ${componentName} from './${componentName}';
export default ${componentName};
`;
}