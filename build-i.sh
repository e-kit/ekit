echo packages/${1/packages\//}
if [[ -d packages/${1/packages\//} ]]; then
  p=${1/packages\//}
  lerna exec --scope @ekit/${p/\//} -- npm run build
fi
