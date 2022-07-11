#!/bin/bash

DIR="./dist"

if [ -d "$DIR" ]; then
    rm -rf $DIR
    echo "Removed $DIR"
fi