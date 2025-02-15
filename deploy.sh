#!/bin/bash

# Variables
USER_NAME="ssh300006351"
SERVER_NAME="ngcobalt64.manitu.net"
REMOTE_DIR="/home/sites/site100035030/web/kritoandthestoker.de"
LOCAL_DIR="dist"

# Ensure LOCAL_DIR exists
if [ ! -d "$LOCAL_DIR" ]; then
    echo "Error: Local directory '$LOCAL_DIR' does not exist."
    exit 1
fi

# Run rsync to upload the directory
rsync -avz --delete --progress "$LOCAL_DIR/" "$USER_NAME@$SERVER_NAME:$REMOTE_DIR"

# Check if rsync was successful
if [ $? -eq 0 ]; then
    echo "Upload completed successfully."
else
    echo "Upload failed."
    exit 1
fi
