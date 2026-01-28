pipeline{
  agent {
    label 'dev-madie'
  }
  options {
    buildDiscarder(logRotator(numToKeepStr:'20'))
  }
  parameters {
    choice(choices: ['cy:parallel:test','cy:parallel:test:ui:smoketests','cy:parallel:dev:ui:smoketests','cy:parallel:test:all:tests','test:specific:files:parallel','dev:all:ui:tests','dev:all:tests','dev:ui:smoketests', 'dev:ui:cqllibrary:cqlEditor','dev:ui:cqllibrary', 'dev:ui:measure:cqlEditor', 'dev:measure:editMeasure:ui:tests', 'dev:ui:testCases:testCasePopulationValues','dev:ui:cqllibrary:versionAndDraft','dev:all:services:tests','dev:services:measureService:tests', 'dev:services:cqlLibrariesService:tests', 'dev:services:cqlTranslatorService:tests', 'dev:services:terminologyService:tests', 'dev:ui:testCases', 'test:all:tests:headed', 'test:all:tests', 'test:all:ui:tests', 'test:all:services:tests','test:services:measureservice:testcaseexport','test:services:measureservice:measureversion','test:ui:smoketests','test:ui:smoketests:headed','test:ui:testcases','test:ui:cqllibrary:cqllibrarydelete', 'test:ui:smoketests:endtoend:cohortepisodeencounter','test:ui:smoketests:endtoend:proportionepisode','test:ui:smoketests:endtoend:CVPatientWithStratification','test:ui:smoketests:endtoend:RatioEpisodeSingleIPNoMO','test:ui:testcases:versionedmeasure:VersionedMeasure_CreateEditDeleteTestCase', 'impl:all:tests','impl:all:ui:tests','impl:all:services:tests','impl:ui:smoketests'], description:'Choose the Test script to run', name: 'TEST_SCRIPT')
    choice(name:'BUILD_CONTAINER', description:'Rebuild Cypress Container?', choices:['no','yes'])
  }
  environment {
    AWS_ACCOUNT = credentials('HCQIS_dev')
    CYPRESS_DEV_USERNAME=credentials('CYPRESS_TEST_USERNAME')
    CYPRESS_DEV_USERNAME2=credentials('CYPRESS_TEST_USERNAME2')
    CYPRESS_DEV_USERNAME3=credentials('CYPRESS_TEST_USERNAME3')
    CYPRESS_DEV_PASSWORD=credentials('CYPRESS_TEST_PASSWORD')
    CYPRESS_DEV_PASSWORD2=credentials('CYPRESS_TEST_PASSWORD2')
    CYPRESS_DEV_PASSWORD3=credentials('CYPRESS_TEST_PASSWORD3')
    CYPRESS_DEV_ALT_USERNAME=credentials('CYPRESS_TEST_ALT_USERNAME')
    CYPRESS_DEV_ALT_USERNAME2=credentials('CYPRESS_TEST_ALT_USERNAME2')
    CYPRESS_DEV_ALT_USERNAME3=credentials('CYPRESS_TEST_ALT_USERNAME3')
    CYPRESS_DEV_ALT_PASSWORD=credentials('CYPRESS_TEST_ALT_PASSWORD')
    CYPRESS_DEV_ALT_PASSWORD2=credentials('CYPRESS_TEST_ALT_PASSWORD2')
    CYPRESS_DEV_ALT_PASSWORD3=credentials('CYPRESS_TEST_ALT_PASSWORD3')
    CYPRESS_DEV_MEASURESHARING_API_KEY=credentials('CYPRESS_DEV_MEASURESHARING_API_KEY')
    CYPRESS_DEV_DELETEMEASUREADMIN_API_KEY=credentials('CYPRESS_DEV_DELETEMEASUREADMIN_API_KEY')
    CYPRESS_DEV_ADMIN_API_KEY=credentials('CYPRESS_DEV_ADMIN_API_KEY')
    CYPRESS_TEST_USERNAME=credentials('CYPRESS_TEST_USERNAME')
    CYPRESS_TEST_USERNAME2=credentials('CYPRESS_TEST_USERNAME2')
    CYPRESS_TEST_USERNAME3=credentials('CYPRESS_TEST_USERNAME3')
    CYPRESS_TEST_PASSWORD=credentials('CYPRESS_TEST_PASSWORD')
    CYPRESS_TEST_PASSWORD2=credentials('CYPRESS_TEST_PASSWORD2')
    CYPRESS_TEST_PASSWORD3=credentials('CYPRESS_TEST_PASSWORD3')
    CYPRESS_TEST_ALT_USERNAME=credentials('CYPRESS_TEST_ALT_USERNAME')
    CYPRESS_TEST_ALT_USERNAME2=credentials('CYPRESS_TEST_ALT_USERNAME2')
    CYPRESS_TEST_ALT_USERNAME3=credentials('CYPRESS_TEST_ALT_USERNAME3')
    CYPRESS_TEST_ALT_PASSWORD=credentials('CYPRESS_TEST_ALT_PASSWORD')
    CYPRESS_TEST_ALT_PASSWORD2=credentials('CYPRESS_TEST_ALT_PASSWORD2')
    CYPRESS_TEST_ALT_PASSWORD3=credentials('CYPRESS_TEST_ALT_PASSWORD3')
    CYPRESS_TEST_MEASURESHARING_API_KEY=credentials('CYPRESS_TEST_MEASURESHARING_API_KEY')
    CYPRESS_TEST_DELETEMEASUREADMIN_API_KEY=credentials('CYPRESS_TEST_DELETEMEASUREADMIN_API_KEY')
    CYPRESS_TEST_ADMIN_API_KEY=credentials('CYPRESS_TEST_ADMIN_API_KEY')
    CYPRESS_IMPL_USERNAME=credentials('CYPRESS_IMPL_USERNAME')
    CYPRESS_IMPL_PASSWORD=credentials('CYPRESS_IMPL_PASSWORD')
    CYPRESS_IMPL_ALT_USERNAME=credentials('CYPRESS_IMPL_ALT_USERNAME')
    CYPRESS_IMPL_ALT_PASSWORD=credentials('CYPRESS_IMPL_ALT_PASSWORD')
    CYPRESS_VSAC_API_KEY=credentials('CYPRESS_VSAC_API_KEY')
    CYPRESS_DEV_MADIE_CLIENTID=credentials('CYPRESS_DEV_MADIE_CLIENTID')
    CYPRESS_DEV_MADIE_CODECHALLENGE=credentials('CYPRESS_DEV_MADIE_CODECHALLENGE')
    CYPRESS_DEV_MADIE_REDIRECTURI=credentials('CYPRESS_DEV_MADIE_REDIRECTURI')
    CYPRESS_DEV_MADIE_AUTHURI=credentials('CYPRESS_DEV_MADIE_AUTHURI')
    CYPRESS_MADIE_CODEVERIFIER=credentials('CYPRESS_MADIE_CODEVERIFIER')
    CYPRESS_TEST_MADIE_CLIENTID=credentials('CYPRESS_TEST_MADIE_CLIENTID')
    CYPRESS_TEST_MADIE_REDIRECTURI=credentials('CYPRESS_TEST_MADIE_REDIRECTURI')
    CYPRESS_TEST_MADIE_AUTHURI=credentials('CYPRESS_TEST_MADIE_AUTHURI')
    CYPRESS_IMPL_MADIE_CLIENTID=credentials('CYPRESS_IMPL_MADIE_CLIENTID')
    CYPRESS_IMPL_MADIE_REDIRECTURI=credentials('CYPRESS_IMPL_MADIE_REDIRECTURI')
    CYPRESS_IMPL_MADIE_AUTHURI=credentials('CYPRESS_IMPL_MADIE_AUTHURI')
    CYPRESS_IMPL_MEASURESHARING_API_KEY=credentials('CYPRESS_IMPL_MEASURESHARING_API_KEY')
    CYPRESS_IMPL_DELETEMEASUREADMIN_API_KEY=credentials('CYPRESS_IMPL_DELETEMEASUREADMIN_API_KEY')
    CYPRESS_IMPL_ADMIN_API_KEY=credentials('CYPRESS_IMPL_ADMIN_API_KEY')
    CYPRESS_REPORT_BUCKET=credentials('CYPRESS_REPORT_BUCKET')
    NODE_OPTIONS=credentials('NODE_OPTIONS')
    PROFILE='dev-madie'
  }
  stages {
    stage('ECR Login'){
      steps{
        sh '''
          aws --profile ${PROFILE} ecr get-login-password --region us-east-1 \
          | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com
        '''
      }
    }

    stage('Build Cypress Container'){
      when{
        expression { params.BUILD_CONTAINER == 'yes' }
      }
      steps{
        sh '''
          docker build -t madie-dev-cypress-ecr .
          docker tag madie-dev-cypress-ecr:latest ${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/madie-dev-cypress-ecr:latest
          docker push ${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/madie-dev-cypress-ecr:latest
        '''
      }
    }

    stage('Run Tests') {
      agent {
        docker {
          image "${env.AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/madie-dev-cypress-ecr:latest"
          args "-u 0 -v $HOME/.npm:/.npm"
          reuseNode true
        }
      }
      steps {
        slackSend(color: "#ffff00", message: "#${env.BUILD_NUMBER} (<${env.BUILD_URL}Open>) - ${params.TEST_SCRIPT} Tests Started")
        catchError(buildResult: 'FAILURE') {
          sh '''
            cd /app/cypress
            npm run delete:reports
            npm run ${TEST_SCRIPT}
            echo $?
          '''
        }
      }
      post {
        always{
          sh '''
            # Extract initial failures as one-file-per-line
            export XDG_RUNTIME_DIR=/run/user/$(id -u)
            cd /app/cypress

            # Some runs may not produce runner-results; avoid breaking the build
            if ls /app/runner-results/*.json >/dev/null 2>&1; then
              cat /app/runner-results/*.json \
                | jq -r 'select(.failures > 0) | .file' \
                | sed '/^null$/d' \
                > failures-${BUILD_NUMBER}.txt
              cp failures-${BUILD_NUMBER}.txt ${WORKSPACE}/ || true
            else
              # Create an empty failure file so downstream logic is consistent
              : > ${WORKSPACE}/failures-${BUILD_NUMBER}.txt
            fi
          '''
          archiveArtifacts artifacts: "failures-${env.BUILD_NUMBER}.txt", onlyIfSuccessful: false
        }
      }
    }

    stage('Re-run Failures Twice') {
      when {
