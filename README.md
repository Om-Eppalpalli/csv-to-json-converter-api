# CSV to JSON API

## Setup
1. Install dependencies:
    ```bash
    npm install
    ```
2. Configure environment variables in `.env` file.
3. Create PostgreSQL table as per schema provided.

## Usage
1. Start the server:
    ```bash
    node src/server.js
    ```
2. Access the endpoint to process CSV:
    - `GET /process-csv`

## Endpoints
- `/` - Base endpoint to check server status.
- `/process-csv` - Endpoint to process the CSV file and calculate age distribution.

## Notes
- Ensure the CSV file is placed in the location specified in the `.env` file.
- The first line in the CSV file should be headers.
- Handles properties with infinite depth using dot notation.
