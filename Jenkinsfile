pipeline {
+     2:     agent any
+     3:
+     4:     environment {
+     5:         DOCKER_IMAGE = 'stylehub-online-shop'
+     6:         DOCKER_TAG = "${env.BUILD_NUMBER}"
+     7:         EC2_SERVER = 'ec2-user@your-ec2-ip' // Replace with your EC2 instance IP
+     8:         SSH_CREDENTIALS = 'ec2-ssh-key' // ID of your Jenkins credentials
+     9:     }
+    10:
+    11:     stages {
+    12:         stage('Checkout') {
+    13:             steps {
+    14:                 checkout scm
+    15:             }
+    16:         }
+    17:
+    18:         stage('Build Docker Image') {
+    19:             steps {
+    20:                 script {
+    21:                     sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
+    22:                     sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
+    23:                 }
+    24:             }
+    25:         }
+    26:
+    27:         stage('Test') {
+    28:             steps {
+    29:                 // Add tests if you have any
+    30:                 echo "Running tests..."
+    31:                 // Example: sh "npm test"
+    32:             }
+    33:         }
+    34:
+    35:         stage('Push to Registry') {
+    36:             steps {
+    37:                 script {
+    38:                     // If you're using a private Docker registry, add credentials and push commands here
+    39:                     // For example with Docker Hub:
+    40:                     // docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
+    41:                     //     sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
+    42:                     //     sh "docker push ${DOCKER_IMAGE}:latest"
+    43:                     // }
+    44:                     echo "Pushing to registry..."
+    45:                 }
+    46:             }
+    47:         }
+    48:
+    49:         stage('Deploy to EC2') {
+    50:             steps {
+    51:                 script {
+    52:                     // Using SSH to deploy to EC2
+    53:                     sshagent([SSH_CREDENTIALS]) {
+    54:                         // Copy docker-compose.yml to the server
+    55:                         sh "scp docker-compose.yml ${EC2_SERVER}:/home/ec2-user/stylehub/"
+    56:
+    57:                         // SSH into the server and deploy
+    58:                         sh """
+    59:                             ssh ${EC2_SERVER} '
+    60:                                 cd /home/ec2-user/stylehub
+    61:                                 docker-compose pull
+    62:                                 docker-compose down
+    63:                                 docker-compose up -d
+    64:                             '
+    65:                         """
+    66:                     }
+    67:                 }
+    68:             }
+    69:         }
+    70:     }
+    71:
+    72:     post {
+    73:         success {
+    74:             echo "Pipeline completed successfully!"
+    75:         }
+    76:         failure {
+    77:             echo "Pipeline failed!"
+    78:         }
+    79:         always {
+    80:             // Clean up local Docker images
+    81:             sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
+    82:             sh "docker rmi ${DOCKER_IMAGE}:latest || true"
+    83:         }
+    84:     }
+    85: }
