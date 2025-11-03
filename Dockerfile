# Use a lightweight Node.js image for development
FROM node:20-alpine AS development

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Expose the port used by the React development server
EXPOSE 5173

# Command to run the React development server
CMD ["npm", "run", "dev"]