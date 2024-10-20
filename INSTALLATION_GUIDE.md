
# Installation Guide

### Prerequisites

Before running the application, ensure that the following prerequisites are met:

1. **Node.js & npm:**
   - **Description:** JavaScript runtime environment and package manager.
   - **Version:** Node.js v14 or higher, npm v6 or higher.
   - **Installation:** [Download Node.js](https://nodejs.org/)

2. **Postgres:**
   - **Description:** Database for the backend application.
   - **Installation:** [Download Postgres](https://www.postgresql.org/download/)

2. **Expo CLI:**
   - **Description:** Command-line tool for developing and building Expo applications.
   - **Installation:**
     ```bash
     npm install -g expo-cli
     ```
     
3. **Git:**
   - **Description:** Version control system for cloning the repository.
   - **Installation:** [Download Git](https://git-scm.com/)

4. **iOS/Android Emulator:**
   - **Description:** Simulators for testing the app on different platforms.
   - **Installation:**
     - **iOS:** Xcode with iOS Simulator.
     - **Android:** Android Studio with Android Virtual Device (AVD).



### Running the Backend

To streamline running the backend, use the provided `buildBackend.sh` script:

1. **Run Backend with npm Script:**
   ```bash
   npm run backend
   ```

   *This command executes the `buildBackend.sh` script, which navigates to the backend directory and initiates the build process.*

### Connecting Frontend to Backend 

1. **Run Client with npm Script:**
   ```bash
   npm run client
   ```

   *This command executes the `buildClient.sh` script, which performs the following actions:*
   - Retrieves the local IP address. -see `Update API URL` below-
   - Updates the `.env` file with the API URL using the local IP.
   - Installs frontend dependencies.
   - Builds the app.
   - Starts the iOS simulator.

   *_Note: Ensure that the backend server is running before executing this script._

2. **Update API URL:**
   - The frontend uses a shell script `buildClient.sh` to set the backend API URL based on the local IP address.
   - Ensure that `EXPO_PUBLIC_API_URL` in the `.env` file points to `http://<your-ip>:3000/api`.
   - *We use the local IP address instead of `localhost` because the iOS simulator does not accept `localhost` for API requests.*

### Troubleshooting

- **Backend Connection Issues:**
  - Verify that the backend server is running.
  - Ensure that .env file in the backend directory contains:
    `GOOGLE_CLIENT_ID=69409811355-p2v4j82ni2d7rgb3dp0ubhdoadhdbbt7.apps.googleusercontent.com`
  - Ensure that `EXPO_PUBLIC_API_URL` is correctly set in the `.env` file.
  - Ensure that the PostgreSQL server is running on the computer.

- **Emulator Not Starting:**
  - Ensure that emulators are properly installed and configured.
  - Check that necessary environment variables are set.

- **Missing Dependencies:**
  - Run `npm install` in both frontend and backend directories to install all required packages.

- **IP Address Issues:**
  - If `buildClient.sh` fails to retrieve the IP address, ensure that your machine is connected to a network.
  - Verify that `ipconfig getifaddr en0` returns a valid IP.  If not, check your network settings or modify the script to use the correct network interface in case you use ethernet. Because en0 returns WIFI IP address.