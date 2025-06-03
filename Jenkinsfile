pipeline {
    agent any

    stages {
        stage('Git Clone') {
            steps {
                echo 'Cloning StyleHub Online Shop repository'
                git url: 'https://github.com/yourusername/StyleHub-Online-Shop.git'
                // Replace the URL above with your actual Git repository URL
            }
        }

        stage('Build') {
            steps {
                echo 'Building the StyleHub Online Shop application'
                sh 'docker build -t stylehub-online-shop .'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests for StyleHub Online Shop'
                // Add test commands here
                // For example: sh 'npm test' if you have JavaScript tests
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying StyleHub Online Shop'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
        }
        always {
            echo 'Cleaning up workspace'
            // Add cleanup commands if needed
        }
    }
}

