# 开发指南

## 新增包

仅需要名字即可，一直回车，不需要 scope，不需要任何信息

```shell
sh create xxx
```

## 安装包

```shell
lerna link convert
npm i
```

## 构建包

```shell
sh build-i.sh packages/xxxx
```

## 测试包

```shell
sh test-i.sh packages/xxxx
```
