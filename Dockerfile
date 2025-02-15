FROM node:8

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock to leverage caching
COPY package.json yarn.lock ./

RUN rm -rf ./node_modules

# Install dependencies
RUN yarn install --frozen-lockfile
# RUN yarn install

# Copy the rest of the application files
COPY . .

# Expose the application port (if applicable, change as needed)
EXPOSE 3000

# Command to run the application (modify as needed)
CMD ["node", "server.js"]
