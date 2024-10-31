#!/bin/bash

# Set Node options
export NODE_OPTIONS=--openssl-legacy-provider

# Build the project
npm run build

# Deploy to Firebase
firebase deploy
