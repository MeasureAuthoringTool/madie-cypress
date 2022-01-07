pipeline{
        agent {
            label 'dev-madie'
        }

    options {
        buildDiscarder(logRotator(numToKeepStr:'20'))
    }

    parameters {
        choice(choices: ['dev:all:ui:tests:report','dev:all:tests:report'], description:'Choose the Test script to run', name: 'TEST_SCRIPT')
        choice(name:'BUILD_CONTAINER', description:'Rebuild Cypress Container?', choices:['no','yes'])
    }

    environment{
        AWS_ACCOUNT = credentials('HCQIS_DEV')
        CYPRESS_DEV_USERNAME=credentials('CYPRESS_DEV_USERNAME')
        CYPRESS_DEV_PASSWORD=credentials('CYPRESS_DEV_PASSWORD')
        CYPRESS_TEST_USERNAME=credentials('CYPRESS_TEST_USERNAME')
        CYPRESS_TEST_PASSWORD=credentials('CYPRESS_TEST_PASSWORD')
        CYPRESS_VSAC_API_KEY=credentials('CYPRESS_VSAC_API_KEY')
        CYPRESS_REPORT_BUCKET=credentials('CYPRESS_REPORT_BUCKET')
    }

 stages {
    stage('ECR Login'){
      steps{
        sh 'aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com'
      }
    }
    stage('Build Cypress Container'){
      when{
        expression { BUILD_CONTAINER == 'yes' }
      }
      steps{
          sh '''
            docker build -t madie-dev-cypress-ecr .
            docker tag madie-dev-cypress-ecr:latest ${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/mat-dev-cypress-ecr:latest
            docker push ${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/mat-dev-cypress-ecr:latest
          '''
      }
    }

    stage('Run Tests') {
        agent {
            docker {
                image '${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/mat-dev-cypress-ecr:latest'
		args '-u 0 -v $HOME/.npm:/.npm'
                reuseNode true
            }
        }
            steps {
                slackSend(color: "#ffff00", message: "#${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>) - ${TEST_SCRIPT} Tests Started")
                sh '''
                cd /app/cypress
                npm run ${TEST_SCRIPT}
		aws s3 sync --acl public-read /app/mochawesome-report/ ${CYPRESS_REPORT_BUCKET}/mochawesome-report-${BUILD_NUMBER}/
		echo "find reports at https://mat-reports.s3.amazonaws.com/mochawesome-report-${BUILD_NUMBER}/mochawesome.html"
                tar -czf /app/mochawesome-report-${BUILD_NUMBER}.tar.gz -C /app/mochawesome-report/ . 
                cp /app/mochawesome-report-${BUILD_NUMBER}.tar.gz ${WORKSPACE}/
                '''
            }
        }
   }

  post {
      always{
        archiveArtifacts artifacts: "mochawesome-report-${BUILD_NUMBER}.tar.gz"
      }
      success{
        slackSend(color: "#00ff00", message: "${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>) ${TEST_SCRIPT} Tests Finished, Review report at https://mat-reports.s3.amazonaws.com/mochawesome-report-${BUILD_NUMBER}/mochawesome.html")
      }
      failure{
	sh 'echo fail'
        slackSend(color: "#ff0000", message: "${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>) ${TEST_SCRIPT} Tests Failed to Run or complete successfully")
      }
  }
}
