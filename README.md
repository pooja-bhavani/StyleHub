<<<<<<< HEAD
=======
<<<<<<< HEAD
# StyleHub-Online-Shop
=======
>>>>>>> 05da805 (Resolved merge conflict and added Jenkinsfile)
# StyleHub Online Shop

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
<<<<<<< HEAD
=======
>>>>>>> 492a44a (added files of e-commerce app)
>>>>>>> 05da805 (Resolved merge conflict and added Jenkinsfile)
