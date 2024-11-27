#!/bin/bash

yarn build

# Remove the current dist directory
rm -rf ../dist

# Copy the build directory to dist
cp -r build ../dist
