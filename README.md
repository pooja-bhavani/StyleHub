<img width="1470" height="956" alt="Screenshot 2025-07-20 at 9 35 17 PM" src="https://github.com/user-attachments/assets/30c1acb7-e30c-4c23-9b6b-ff711aa99af3" /># StyleHub Online Shop
If you click you will see the architecture of the app


https://stylehub-dev.netlify.app/ 

![image](https://github.com/user-attachments/assets/63f804a4-9c5c-461f-9915-4dc717d45383)
![image](https://github.com/user-attachments/assets/4cc7635b-375d-4899-b32f-c440d4e0c4fc)
<img width="1470" height="956" alt="Screenshot 2025-07-20 at 9 35 28 PM" src="https://github.com/user-attachments/assets/17566052-d5a9-437c-ab20-63eed078f9e9" />


Kubernetes-MCP-Server

![image](https://github.com/user-attachments/assets/cba586a0-d233-4335-95c2-f397bf96cbf8)

![image](https://github.com/user-attachments/assets/442336dd-7f1b-4d76-b291-1b6f660545a3)

# A modern e-commerce website for fashion and lifestyle products.

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
