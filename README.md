# E-Municipal Portal Full Stack Application

This is a complete municipal service portal designed to facilitate interaction between Citizens and Administrators. 

## Project Architecture

1. **Backend** (`eportal-api`): ASP.NET Core Web API, Entity Framework Core, PostgreSQL, JWT Authentication.
2. **Frontend** (`eportal-web`): React (Vite), Tailwind CSS, React Router, Axios, Lucide Icons.

## Prerequisites

1. **.NET SDK (8.0 or 7.0)**: Required to build and run the backend. Download from [Microsoft](https://dotnet.microsoft.com/download).
2. **Node.js**: Required to install frontend dependencies and run the React app. Download from [Node.js](https://nodejs.org/).
3. **PostgreSQL**: Must be running locally on your machine with the default configuration (`Host=localhost;Username=postgres;Password=postgres`).

## Setup Instructions

### 1. Backend Setup (.NET)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd eportal-api
   ```
2. Restore NuGet dependencies:
   ```bash
   dotnet restore
   ```
3. Set up the Database (Entity Framework Core tools required):
   ```bash
   dotnet tool install --global dotnet-ef
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```
   *Note: Ensure your PostgreSQL service is running and credentials match `appsettings.json`.*
4. Run the API:
   ```bash
   dotnet run
   ```
   The API will typically start at `http://localhost:5000` or `https://localhost:5001`. Swagger UI is available at `/swagger`.

### 2. Frontend Setup (React)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd eportal-web
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

## Sample Testing Workflow

1. Navigate to the frontend in a browser.
2. Register a new user with the `Admin` role.
3. Log out and register a new user with the `Citizen` role.
4. As a citizen, log in to register a complaint (with an optional image file), and view schedules.
5. Log in as an admin to view dashboard statistics, manage all complaints, assign employees, and upload proof of completion images.
