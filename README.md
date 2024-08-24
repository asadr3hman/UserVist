# UserVista

**UserVista** is a comprehensive platform for managing user profiles and avatars. Built with NestJS and Node.js, UserVista provides functionalities to create users, fetch user details from the ReqRes API, and handle user avatars, including fetching, storing, and deleting them.

## Features

- **Create Users**: Add new users to the database.
- **Fetch User Data**: Retrieve user information from the ReqRes API.
- **Manage Avatars**:
  - Fetch and store user avatars.
  - Return avatars as base64-encoded strings.
  - Delete avatars from the file system and database.
- **RabbitMQ Integration**: Publish user-related events to RabbitMQ for asynchronous processing and communication between microservices.

## API Endpoints

- **POST /api/users**
  - Create a new user.
  - **Request Body:** `UserDto`
  - **Response:** Success or error message.

- **GET /api/users/:userId**
  - Fetch user data by ID from the ReqRes API.
  - **Response:** User data.

- **GET /api/users/:userId/avatar**
  - Fetch and return the user's avatar as a base64-encoded string.
  - **Response:** Base64-encoded avatar image.

- **DELETE /api/users/:userId/avatar**
  - Delete the user's avatar from the file system and database.
  - **Response:** Status code 204 (No Content) or error message.

## Installation

To get started with UserVista, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/uservista.git

2. Navigate to the Project Directory

   ```bash
   cd uservista

3. Install Dependencies

   ```bash
    npm install
4. Run the Application

   ```bash
   npm run start

## RabbitMQ Integration

UserVista uses RabbitMQ as a message broker to handle asynchronous events related to user operations. When a new user is created, an event is emitted to the RabbitMQ queue, which can be consumed by different microservices or components within the system.

## Setting Up RabbitMQ

The easiest way to set up RabbitMQ is by using Docker. Follow the steps below to spin up a RabbitMQ container:

### 1. Using Docker

1. **Install Docker**

   If you don't have Docker installed, follow the [official Docker installation guide](https://docs.docker.com/get-docker/) for your operating system.

2. **Run RabbitMQ in a Docker Container**

   Execute the following command in your terminal to start a RabbitMQ container:

   ```bash
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

3. **Access the RabbitMQ Management Console**

    Open your browser and go to http://localhost:15672. Use the default credentials:
    
        Username: guest
        Password: guest
### 2. Alternative: Manual Installation

  If you prefer not to use Docker, you can manually install RabbitMQ by following the [official RabbitMQ installation guide](https://www.rabbitmq.com/docs/download) for your operating system.



## Contributing

  Contributions are welcome! If you have suggestions or improvements, please submit a pull request or open an issue on GitHub.
