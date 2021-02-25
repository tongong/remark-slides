#!/usr/bin/env sh
# this takes a .remark file and wraps it in the html template

if [ $# -eq 0 ]; then
    echo -e "No arguments specified.">&2
    exit 1
fi

if [ ! -f "$1" ]; then
    echo "$1: No such file">&2
    exit 1
fi

remarkdir=$(dirname "$0")
file=$(readlink -f "$1")
sourcebase="${file%.*}"
cat "$remarkdir"/template-start.html "$1" "$remarkdir"/template-end.html > "$sourcebase".html
