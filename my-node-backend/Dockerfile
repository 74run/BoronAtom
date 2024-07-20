# Use an official Node.js runtime as the base image
FROM node:14

# Install TeX Live
RUN apt-get update && \
    apt-get install -y texlive-full

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install Node.js dependencies
RUN npm install

# Expose port 3000
EXPOSE 3000

# Command to start your Node.js application
CMD ["node", "index.js"]
