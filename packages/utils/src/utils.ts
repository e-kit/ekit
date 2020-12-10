/**
 * @file: tkit utils 函数
 * @author: yangqianjun
 * @Date: 2019-07-20 15:12:00
 * @LastEditors: yangqianjun
 * @LastEditTime: 2019-12-19 11:42:23
 */

import * as fs from 'fs';
import * as path from 'path';

/** 获取当前项目目录绝对路径 */
export const TkitAppDirectory = fs.realpathSync(process.cwd());
/** path.join */
export const concatDirectory = (...ps: string[]) => path.join(...ps);

/** 按照项目目录/文件名、Tkit 模块目录名/文件名的顺序查找文件，如果文件存在，则返回文件的绝对路径  */
export const ensureFile = function(file: string, moduleDirectory: string) {
  return fs.existsSync(`${TkitAppDirectory}/${file}`) ||
    fs.existsSync(`${TkitAppDirectory}/${file}.js`)
    ? `${TkitAppDirectory}/${file}`
    : `${moduleDirectory}/${file}`;
};

/** 按照项目目录/文件名、Tkit 模块目录名/文件名的顺序查找文件，会把路径里的 `/config/` 目录替换为 `/lib/`，如果文件存在，则返回文件的绝对路径  */
export const ensureFileModern = function(file: string, moduleDirectory: string) {
  return fs.existsSync(`${TkitAppDirectory}/${file}`) ||
    fs.existsSync(`${TkitAppDirectory}/${file}.js`)
    ? `${TkitAppDirectory}/${file}`
    : `${moduleDirectory}/${file.replace(/config\//g, 'lib/')}`;
};

/** 过滤掉数组里不存在的文件名 */
export const ensureFiles = function(files: string[]) {
  return files.filter(file => fs.existsSync(file));
};

/** 转换为相对项目目录的相对路径 */
export const resolveApp = (relativePath: string) => path.resolve(TkitAppDirectory, relativePath);
