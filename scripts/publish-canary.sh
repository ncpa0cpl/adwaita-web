#!/usr/bin/env bash

echo "Publishing canary version $CURRENT_VERSION"

npm version --preid canary-$(git rev-parse HEAD) prerelease
CURRENT_VERSION=$(yarn --silent current-version)

echo "Generating documentation"
yarn generate-docs

echo "Bundling examples"
yarn bundle-examples $CURRENT_VERSION

git add --all
git commit -m "docs: autogenerated documentation and examples"
git push --no-verify

npm publish --tag canary