pipeline {
    agent any

    environment {
        // Replace with your actual Docker Hub username
        DOCKER_HUB_USER = '00sv'
        IMAGE_NAME = 'customer-feedback-management'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Prisma') {
            steps {
                sh 'npx prisma generate'
                sh 'npx prisma migrate deploy'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh 'docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin'
                        sh 'docker push ${IMAGE_NAME}:${BUILD_NUMBER}'
                        sh 'docker push ${IMAGE_NAME}:latest'
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
        success {
            echo "✅ Build and Push Successful!"
        }
        failure {
            echo "❌ Build Failed!"
        }
    }
}