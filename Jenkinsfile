pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = '00sv'
        IMAGE_NAME = '00sv/customer-feedback-management'
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
                withCredentials([usernamePassword(credentialsId: 'database-credentials', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASS')]) {
                    sh 'DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/customer_feedback npx prisma generate'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'database-credentials', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASS')]) {
                    sh 'docker build --build-arg DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/customer_feedback -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
                }
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