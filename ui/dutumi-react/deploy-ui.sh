#!/bin/bash

yarn build

# Remove the current dist directory
rm -rf dist-prod

# Copy the build directory to dist
cp -r build dist-prod

git add .
git commit -m "Deployed UI"
git push