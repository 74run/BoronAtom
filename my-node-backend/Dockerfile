# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app


# Install system dependencies
RUN apt-get update && apt-get install -y \
    texlive-full \
    && apt-get clean

# Install necessary packages including wget and TeX Live
RUN apt-get update && apt-get install -y wget texlive-full

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .


# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

# Expose the port the app runs on
EXPOSE 3000