import * as path from 'path';
import * as ts from 'typescript';

/**
 * 解析一个 .ts 文件并返回错误信息
 * @param files 文件名
 * @param directory 绝对路径
 * @param runtimeCompilerOptions 运行时额外的配置项，默认 {}
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const parser = (
  files: string[],
  directory: string,
  runtimeCompilerOptions: ts.CompilerOptions = {}
) => {
  /** 当前执行脚本的目录 */
  const cwd = process.cwd();
  const configJSON = require(path.join(cwd, 'tsconfig.json'));
  const { options } = ts.parseJsonConfigFileContent(configJSON, ts.sys, cwd);

  const fileNameMap: { [file: string]: any[] } = {};
  const errorMap: { [file: string]: any[] } = {};

  const program = ts.createProgram(
    files.map((file) => {
      const p = path.join(directory, file);
      fileNameMap[p] = errorMap[file] = [];
      return p;
    }),
    {
      ...options,
      ...runtimeCompilerOptions,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
    }
  );
  const allDiagnostics = ts.getPreEmitDiagnostics(program);
  allDiagnostics.map((d) => {
    if (d.file) {
      if (d.file.fileName in fileNameMap) {
        const errors = fileNameMap[d.file.fileName];
        const { relatedInformation, code, category, messageText } = d;
        errors.push({
          fileName: path.relative(cwd, d.file.fileName),
          code,
          category,
          messageText: ts.flattenDiagnosticMessageText(messageText, '\n'),
        });
        if (Array.isArray(relatedInformation)) {
          relatedInformation.forEach((d) => {
            const { code, category, messageText, file } = d;
            // 方便测试
            console.log({
              fileName: path.relative(cwd, (file && file.fileName) || ''),
              code,
              category,
              messageText: ts.flattenDiagnosticMessageText(messageText, '\n'),
            });
          });
        }
      }
    }
  });
  return errorMap;
};
