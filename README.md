# Ticket-Notify

A real-time train ticket availability checking system for Indian Railways that helps users monitor ticket status for future dates.

## Features

- Real-time ticket availability checking
- Support for multiple train classes (1A, 2A, 3A, SL, etc.)
- Multiple days availability status
- Detailed train information including:
  - Train numbers and names
  - Arrival/Departure times
  - Distance and duration
  - Running days
  - Fare breakdown
- Response time tracking
- API call optimization

## Tech Stack

- **Backend**:
  - Node.js
  - Express
  - TypeScript
  - `Axios` for API calls

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- `npm` or `yarn`
- TypeScript

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ticket-notify.git
cd ticket-notify
```

1. Install dependencies:

```bash
npm install
```

1. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Usage

Access train availability by using the following URL pattern:

```http
http://localhost:3000/today/{FROM_STATION_CODE}/{TO_STATION_CODE}
```

Example:

```http
http://localhost:3000/today/BSB/NDLS
```

## Project Structure

```text
ticket-notify/
├── src/
│   ├── models/           # TypeScript interfaces
│   │   ├── TrainDetails.ts
│   │   └── TrainInterfaces.ts
│   ├── utils/           # Utility functions
│   │   ├── rail-api.ts  # API integration
│   │   ├── date.ts      # Date handling
│   │   └── sleep.ts     # Delay utility
│   ├── server.ts        # Express server setup
│   └── index.ts         # Application entry point
├── public/              # Static assets
└── tests/              # Test files
```

## API Response Format

The application returns ticket availability information in a structured format:

```text
Train Ticket Status on {DATE} (today + {DAYS} days) 🤩

==============================
🚂 {TRAIN_NUMBER} - {TRAIN_NAME}
📍 {FROM_STATION} -> {TO_STATION}

{CLASS_CODE}
{DATE} -> {AVAILABILITY_STATUS}
```

## Development

### Available Scripts

- `npm start` - Starts the production server
- `npm run dev` - Starts the development server with hot-reload

### Adding New Features

1. Create relevant interfaces in `src/models/`
2. Add utility functions in `src/utils/`
3. Update server routes in `src/server.ts`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to Indian Railways for providing the data
- Special thanks to all contributors

## Note

This application is for educational purposes only. Please refer to official IRCTC website for actual bookings.
