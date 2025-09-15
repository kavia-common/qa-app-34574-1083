#!/bin/bash
cd /home/kavia/workspace/code-generation/qa-app-34574-1083/Frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

