#!/bin/bash

find dist/ -type f -name "*.js" -exec sed -i '/logger23.warn("WARNING: Missing strong random number source");/!b; /^\s*\/\*.*\*\/\s*$/b; s/^\(\s*\)logger23.warn("WARNING: Missing strong random number source");/\1\/\* & \*\//g' {} \;
node publish/index.cjs