###
# @file: description
# @author: yangqianjun
# @Date: 2019-12-17 20:16:33
# @LastEditors: yangqianjun
# @LastEditTime: 2020-02-07 18:01:26
###
set -e
pks="utils jest-config event-center event ajax actions tkit model-factory redux-model use-model model async editor pagination use-fetch eslint-config-tkit scripts service"

for p in $pks; do
  rm -rf packages/$p/lib
  sh build-i.sh packages/$p
done
