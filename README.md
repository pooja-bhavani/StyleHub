# StyleHub Online Shop

![image](https://github.com/user-attachments/assets/63f804a4-9c5c-461f-9915-4dc717d45383)
![image](https://github.com/user-attachments/assets/4cc7635b-375d-4899-b32f-c440d4e0c4fc)
![image](https://github.com/user-attachments/assets/f867209c-17ca-4a8d-a9c3-7a537da0c036)


A modern e-commerce website for fashion and lifestyle products.

## Running with Docker

### Prerequisites
- Docker
- Docker Compose

### Steps to run the application

1. Clone the repository
2. Navigate to the project directory
3. Run the following command:

```bash
docker-compose up
```

4. Open your browser and go to http://localhost:8080

### Building the Docker image separately

If you want to build the Docker image separately:

```bash
docker build -t stylehub-online-shop .
```

And then run it:

```bash
docker run -p 8080:80 stylehub-online-shop
```

## Development

To run the site locally without Docker:

1. Navigate to the project directory
2. Start a local server:

```bash
python -m http.server 8000
```

3. Open your browser and go to http://localhost:8000
