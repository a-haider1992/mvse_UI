# Use the official Node.js LTS image as the base image
FROM node:lts-alpine AS build

# Set the working directory
WORKDIR /app

# Install the Angular CLI
RUN npm install -g @angular/cli

# Copy the Angular app source code to the working directory
COPY . .

# Install app dependencies
RUN npm install

# Build the Angular app for production
RUN ng build --configuration=production

# Copy the Node.js server file (index.js) to the working directory
# COPY index.js /app

# Start the Node.js server
CMD ["node", "index.js"]
