#!/bin/bash
# Replace whatever is the current address with special string
HOST_STR="const backend:string =" 
sed -i "s/${HOST_STR}.*/${HOST_STR} \"API_BASE_URL\"/g" src/service/utils.tsx