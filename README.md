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

## Installation

To get started with UserVista, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/uservista.git
