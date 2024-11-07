# Use the official Node.js image as the base image
FROM node:18-alpine

# Install TeX Live and other necessary packages
RUN apk add --no-cache \
    texlive-full \
    ghostscript

# Set the working directory
WORKDIR /usr/src/app



RUN npm install

# Copy the rest of the application code
COPY . .


# Expose the port the app runs on
EXPOSE 5000


# Start the application
CMD ["npm", "start"]

# Expose the port the app runs on
EXPOSE 3000

