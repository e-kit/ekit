set -e
pks="utils jest-config event-center event ajax actions tkit model-factory redux-model use-model model async editor pagination use-fetch eslint-config-tkit scripts service typescript-type-tester"

for p in $pks; do
  if [ -d packages/$p ]; then
    rm -rf packages/$p/lib
    sh build-i.sh packages/$p
  fi
done
