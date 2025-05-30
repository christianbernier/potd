#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] ; then
  echo "Build needed"
  exit 1;
else
  echo "Do not build"  
  exit 0;
fi
