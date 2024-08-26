# Use the official Node.js image as the base image
FROM node:18-alpine as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Serve the app using nginx
FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
