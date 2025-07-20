## Application Architecture

**Website Link:**
https://stylehub-dev.netlify.app/ 

<img width="2914" height="1241" alt="image" src="https://github.com/user-attachments/assets/4e016022-820d-492c-8393-dfe0cf045d66" />

<img width="2897" height="1593" alt="image" src="https://github.com/user-attachments/assets/c7eeecb7-ecc1-46e6-9317-ca476c481f9f" />


## Kubernetes-MCP-Server

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

