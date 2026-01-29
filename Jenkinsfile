pipeline {
  agent { label 'dev-madie' }

  options { buildDiscarder(logRotator(numToKeepStr: '20')) }

  parameters {
    choice(
      choices: [
        'cy:parallel:test','cy:parallel:test:ui:smoketests','cy:parallel:dev:ui:smoketests',
        'cy:parallel:test:all:tests','test:specific:files:parallel','dev:all:ui:tests','dev:all:tests',
        'dev:ui:smoketests','dev:ui:cqllibrary:cqlEditor','dev:ui:cqllibrary','dev:ui:measure:cqlEditor',
        'dev:measure:editMeasure:ui:tests','dev:ui:testCases:testCasePopulationValues',
        'dev:ui:cqllibrary:versionAndDraft','dev:all:services:tests','dev:services:measureService:tests',
        'dev:services:cqlLibrariesService:tests','dev:services:cqlTranslatorService:tests',
        'dev:services:terminologyService:tests','dev:ui:testCases','test:all:tests:headed','test:all:tests',
        'test:all:ui:tests','test:all:services:tests','test:services:measureservice:testcaseexport',
        'test:services:measureservice:measureversion','test:ui:smoketests','test:ui:smoketests:headed',
        'test:ui:testcases','test:ui:cqllibrary:cqllibrarydelete',
        'test:ui:smoketests:endtoend:cohortepisodeencounter',
        'test:ui:smoketests:endtoend:proportionepisode',
        'test:ui:smoketests:endtoend:CVPatientWithStratification',
        'test:ui:smoketests:endtoend:RatioEpisodeSingleIPNoMO',
        'test:ui:testcases:versionedmeasure:VersionedMeasure_CreateEditDeleteTestCase',
        'impl:all:tests','impl:all:ui:tests','impl:all:services:tests','impl:ui:smoketests'
      ],
      description: 'Choose the Test script to run',
      name: 'TEST_SCRIPT'
    )
    choice(name: 'BUILD_CONTAINER', description: 'Rebuild Cypress Container?', choices: ['no','yes'])
  }

  environment {
    AWS_ACCOUNT = credentials('HCQIS_dev')

    // ---------- DEV creds ----------
    CYPRESS_DEV_USERNAME            = credentials('CYPRESS_TEST_USERNAME')
    CYPRESS_DEV_USERNAME2           = credentials('CYPRESS_TEST_USERNAME2')
    CYPRESS_DEV_USERNAME3           = credentials('CYPRESS_TEST_USERNAME3')
    CYPRESS_DEV_PASSWORD            = credentials('CYPRESS_TEST_PASSWORD')
    CYPRESS_DEV_PASSWORD2           = credentials('CYPRESS_TEST_PASSWORD2')
    CYPRESS_DEV_PASSWORD3           = credentials('CYPRESS_TEST_PASSWORD3')
    CYPRESS_DEV_ALT_USERNAME        = credentials('CYPRESS_TEST_ALT_USERNAME')
    CYPRESS_DEV_ALT_USERNAME2       = credentials('CYPRESS_TEST_ALT_USERNAME2')
    CYPRESS_DEV_ALT_USERNAME3       = credentials('CYPRESS_TEST_ALT_USERNAME3')
    CYPRESS_DEV_ALT_PASSWORD        = credentials('CYPRESS_TEST_ALT_PASSWORD')
    CYPRESS_DEV_ALT_PASSWORD2       = credentials('CYPRESS_TEST_ALT_PASSWORD2')
    CYPRESS_DEV_ALT_PASSWORD3       = credentials('CYPRESS_TEST_ALT_PASSWORD3')
    CYPRESS_DEV_MEASURESHARING_API_KEY     = credentials('CYPRESS_DEV_MEASURESHARING_API_KEY')
    CYPRESS_DEV_DELETEMEASUREADMIN_API_KEY = credentials('CYPRESS_DEV_DELETEMEASUREADMIN_API_KEY')
    CYPRESS_DEV_ADMIN_API_KEY       = credentials('CYPRESS_DEV_ADMIN_API_KEY')

    // ---------- TEST creds ----------
    CYPRESS_TEST_USERNAME           = credentials('CYPRESS_TEST_USERNAME')
    CYPRESS_TEST_USERNAME2          = credentials('CYPRESS_TEST_USERNAME2')
    CYPRESS_TEST_USERNAME3          = credentials('CYPRESS_TEST_USERNAME3')
    CYPRESS_TEST_PASSWORD           = credentials('CYPRESS_TEST_PASSWORD')
    CYPRESS_TEST_PASSWORD2          = credentials('CYPRESS_TEST_PASSWORD2')
    CYPRESS_TEST_PASSWORD3          = credentials('CYPRESS_TEST_PASSWORD3')
    CYPRESS_TEST_ALT_USERNAME       = credentials('CYPRESS_TEST_ALT_USERNAME')
    CYPRESS_TEST_ALT_USERNAME2      = credentials('CYPRESS_TEST_ALT_USERNAME2')
    CYPRESS_TEST_ALT_USERNAME3      = credentials('CYPRESS_TEST_ALT_USERNAME3')
    CYPRESS_TEST_ALT_PASSWORD       = credentials('CYPRESS_TEST_ALT_PASSWORD')
    CYPRESS_TEST_ALT_PASSWORD2      = credentials('CYPRESS_TEST_ALT_PASSWORD2')
    CYPRESS_TEST_ALT_PASSWORD3      = credentials('CYPRESS_TEST_ALT_PASSWORD3')
    CYPRESS_TEST_MEASURESHARING_API_KEY     = credentials('CYPRESS_TEST_MEASURESHARING_API_KEY')
    CYPRESS_TEST_DELETEMEASUREADMIN_API_KEY = credentials('CYPRESS_TEST_DELETEMEASUREADMIN_API_KEY')
    CYPRESS_TEST_ADMIN_API_KEY      = credentials('CYPRESS_TEST_ADMIN_API_KEY')

    // ---------- IMPL creds ----------
    CYPRESS_IMPL_USERNAME           = credentials('CYPRESS_IMPL_USERNAME')
    CYPRESS_IMPL_PASSWORD           = credentials('CYPRESS_IMPL_PASSWORD')
    CYPRESS_IMPL_ALT_USERNAME       = credentials('CYPRESS_IMPL_ALT_USERNAME')
    CYPRESS_IMPL_ALT_PASSWORD       = credentials('CYPRESS_IMPL_ALT_PASSWORD')
    CYPRESS_IMPL_MEASURESHARING_API_KEY     = credentials('CYPRESS_IMPL_MEASURESHARING_API_KEY')
    CYPRESS_IMPL_DELETEMEASUREADMIN_API_KEY = credentials('CYPRESS_IMPL_DELETEMEASUREADMIN_API_KEY')
    CYPRESS_IMPL_ADMIN_API_KEY      = credentials('CYPRESS_IMPL_ADMIN_API_KEY')

    // ---------- VSAC ----------
    CYPRESS_VSAC_API_KEY            = credentials('CYPRESS_VSAC_API_KEY')

    // ---------- MADiE OAuth ----------
    CYPRESS_DEV_MADIE_CLIENTID      = credentials('CYPRESS_DEV_MADIE_CLIENTID')
    CYPRESS_DEV_MADIE_CODECHALLENGE = credentials('CYPRESS_DEV_MADIE_CODECHALLENGE')
    CYPRESS_DEV_MADIE_REDIRECTURI   = credentials('CYPRESS_DEV_MADIE_REDIRECTURI')
    CYPRESS_DEV_MADIE_AUTHURI       = credentials('CYPRESS_DEV_MADIE_AUTHURI')
    CYPRESS_MADIE_CODEVERIFIER      = credentials('CYPRESS_MADIE_CODEVERIFIER')

    CYPRESS_TEST_MADIE_CLIENTID     = credentials('CYPRESS_TEST_MADIE_CLIENTID')
    CYPRESS_TEST_MADIE_REDIRECTURI  = credentials('CYPRESS_TEST_MADIE_REDIRECTURI')
    CYPRESS_TEST_MADIE_AUTHURI      = credentials('CYPRESS_TEST_MADIE_AUTHURI')

    CYPRESS_IMPL_MADIE_CLIENTID     = credentials('CYPRESS_IMPL_MADIE_CLIENTID')
    CYPRESS_IMPL_MADIE_REDIRECTURI  = credentials('CYPRESS_IMPL_MADIE_REDIRECTURI')
    CYPRESS_IMPL_MADIE_AUTHURI      = credentials('CYPRESS_IMPL_MADIE_AUTHURI')

    // ---------- Misc ----------
    CYPRESS_REPORT_BUCKET           = credentials('CYPRESS_REPORT_BUCKET')
    NODE_OPTIONS                    = credentials('NODE_OPTIONS')
    PROFILE = 'dev-madie'
  }

  stages {

    stage('ECR Login') {
      steps {
        sh '''
          aws --profile ${PROFILE} ecr get-login-password --region us-east-1 \
          | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com
        '''
      }
    }

    stage('Build Cypress Container') {
      when { expression { params.BUILD_CONTAINER == 'yes' } }
      steps {
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
        sh '''
          cd ${WORKSPACE}
          if [ ! -d node_modules ]; then
            echo "Installing dependencies in ${WORKSPACE} ..."
            npm ci --no-audit --no-fund || npm install --no-audit --no-fund
          else
            echo "Using existing node_modules in ${WORKSPACE}"
          fi
        '''

        slackSend(color: "#ffff00", message: "#${env.BUILD_NUMBER} (<${env.BUILD_URL}Open>) - ${params.TEST_SCRIPT} Tests Started")

        catchError(buildResult: 'FAILURE') {
          sh '''
            cd ${WORKSPACE}
            # Per-run report: start clean
            npm run delete:reports
            npm run $TEST_SCRIPT
            echo $?
          '''
        }

        // Initial failures list
        sh '''
          cd ${WORKSPACE}
          if ls ${WORKSPACE}/runner-results/*.json >/dev/null 2>&1; then
            cat ${WORKSPACE}/runner-results/*.json \
              | jq -r 'select(.failures > 0) | .file' \
              | sed '/^null$/d' \
              > ${WORKSPACE}/failures-${BUILD_NUMBER}.txt
          else
            : > ${WORKSPACE}/failures-${BUILD_NUMBER}.txt
          fi
        '''

        // Initial per-run Mochawesome bundle
        sh '''
          cd ${WORKSPACE}
          if ls ${WORKSPACE}/cypress/results/*.json >/dev/null 2>&1; then
            npm run combine:reports
            npm run generateOne:report
            tar -czf ${WORKSPACE}/mochawesome-initial-${BUILD_NUMBER}.tar.gz -C ${WORKSPACE}/mochawesome-report/ .
          else
            echo "No mochawesome JSON for initial run; creating empty bundle."
            : > ${WORKSPACE}/mochawesome-initial-${BUILD_NUMBER}.tar.gz || true
          fi
        '''

        // Ensure rerun lists exist
        sh '''
          : > ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt
          : > ${WORKSPACE}/failures-rerun2-${BUILD_NUMBER}.txt
        '''
      }
    }

    stage('Re-run Failures Twice') {
      agent {
        docker {
          image "${env.AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/madie-dev-cypress-ecr:latest"
          args "-u 0 -v $HOME/.npm:/.npm"
          reuseNode true
        }
      }
      steps {
        sh '''
          set -e
          cd ${WORKSPACE}

          if [ ! -s ${WORKSPACE}/failures-${BUILD_NUMBER}.txt ]; then
            echo "No initial failures found. Skipping reruns."
            : > ${WORKSPACE}/mochawesome-rerun1-${BUILD_NUMBER}.tar.gz || true
            : > ${WORKSPACE}/mochawesome-rerun2-${BUILD_NUMBER}.tar.gz || true
            exit 0
          fi

          echo '=== RERUN #1 ==='
          npm run delete:reports
          : > ${WORKSPACE}/test-files.txt
          cat ${WORKSPACE}/failures-${BUILD_NUMBER}.txt > ${WORKSPACE}/test-files.txt
          rm -rf ${WORKSPACE}/runner-results/* || true
          mkdir -p ${WORKSPACE}/runner-results
          npm run test:specific:files:parallel || true

          if ls ${WORKSPACE}/runner-results/*.json >/dev/null 2>&1; then
            cat ${WORKSPACE}/runner-results/*.json \
              | jq -r 'select(.failures > 0) | .file' \
              | sed '/^null$/d' \
              > ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt
          else
            : > ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt
          fi

          if ls ${WORKSPACE}/cypress/results/*.json >/dev/null 2>&1; then
            npm run combine:reports
            npm run generateOne:report
            tar -czf ${WORKSPACE}/mochawesome-rerun1-${BUILD_NUMBER}.tar.gz -C ${WORKSPACE}/mochawesome-report/ .
          else
            echo "No mochawesome JSON for rerun #1; creating empty bundle."
            : > ${WORKSPACE}/mochawesome-rerun1-${BUILD_NUMBER}.tar.gz || true
          fi

          if [ ! -s ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt ]; then
            echo 'No failures left after RERUN #1 – skipping RERUN #2.'
            : > ${WORKSPACE}/mochawesome-rerun2-${BUILD_NUMBER}.tar.gz || true
            exit 0
          fi

          echo '=== RERUN #2 ==='
          npm run delete:reports
          : > ${WORKSPACE}/test-files.txt
          cat ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt > ${WORKSPACE}/test-files.txt
          rm -rf ${WORKSPACE}/runner-results/* || true
          mkdir -p ${WORKSPACE}/runner-results
          npm run test:specific:files:parallel || true

          if ls ${WORKSPACE}/runner-results/*.json >/dev/null 2>&1; then
            cat ${WORKSPACE}/runner-results/*.json \
              | jq -r 'select(.failures > 0) | .file' \
              | sed '/^null$/d' \
              > ${WORKSPACE}/failures-rerun2-${BUILD_NUMBER}.txt
          else
            : > ${WORKSPACE}/failures-rerun2-${BUILD_NUMBER}.txt
          fi

          if ls ${WORKSPACE}/cypress/results/*.json >/dev/null 2>&1; then
            npm run combine:reports
            npm run generateOne:report
            tar -czf ${WORKSPACE}/mochawesome-rerun2-${BUILD_NUMBER}.tar.gz -C ${WORKSPACE}/mochawesome-report/ .
          else
            echo "No mochawesome JSON for rerun #2; creating empty bundle."
            : > ${WORKSPACE}/mochawesome-rerun2-${BUILD_NUMBER}.tar.gz || true
          fi
        '''
      }
    }

    stage('Reports') {
      agent {
        docker {
          image "${env.AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/madie-dev-cypress-ecr:latest"
          args "-u 0 -v $HOME/.npm:/.npm"
          reuseNode true
        }
      }
      steps {
        archiveArtifacts artifacts: "mochawesome-initial-${env.BUILD_NUMBER}.tar.gz, mochawesome-rerun1-${env.BUILD_NUMBER}.tar.gz, mochawesome-rerun2-${env.BUILD_NUMBER}.tar.gz, failures-${env.BUILD_NUMBER}.txt, failures-rerun1-${env.BUILD_NUMBER}.txt, failures-rerun2-${env.BUILD_NUMBER}.txt", onlyIfSuccessful: false
      }
    }
  }

  post {
    always {
      script {
        try {
          String ws = env.WORKSPACE
          String bn = env.BUILD_NUMBER

          def readList = { String p -> fileExists(p) ? readFile(p).readLines().findAll { it?.trim() } : [] }
          List<String> l0 = readList("${ws}/failures-${bn}.txt")
          List<String> l1 = readList("${ws}/failures-rerun1-${bn}.txt")
          List<String> l2 = readList("${ws}/failures-rerun2-${bn}.txt")

          int c0 = l0.size()
          int c1 = l1.size()
          int c2 = l2.size()

          boolean passed = (c0 == 0) || (c0 > 0 && c1 == 0) || (c1 > 0 && c2 == 0)

          String outcome =
            (c0 == 0) ? "✅ Passed on the initial run." :
            (c1 == 0) ? "✅ Passed after the 1st rerun. (initial: ${c0})" :
            (c2 == 0) ? "✅ Passed after the 2nd rerun. (initial: ${c0}, after rerun #1: ${c1})"
                       : "❌ Still failing after the 2nd rerun."

          String urlInit = "${env.BUILD_URL}artifact/mochawesome-initial-${bn}.tar.gz"
          String urlR1   = "${env.BUILD_URL}artifact/mochawesome-rerun1-${bn}.tar.gz"
          String urlR2   = "${env.BUILD_URL}artifact/mochawesome-rerun2-${bn}.tar.gz"

          String msg = """\
${passed ? "All test cases passed" : "Failures remain after 2nd rerun"}
Outcome: ${outcome}

Counts:
• Initial failures: ${c0}
• After rerun #1:  ${c1}
• After rerun #2:  ${c2}

Reports:
• initial: ${urlInit}
• rerun1 : ${urlR1}
• rerun2 : ${urlR2}

${env.JOB_NAME} #${bn} (<${env.BUILD_URL}Open>)
""".stripIndent()

          currentBuild.result = passed ? 'SUCCESS' : 'FAILURE'
          slackSend(color: passed ? "#36a64f" : "#ff0000", message: msg)
        } catch (e) {
          echo "Post summary/Slack failed: ${e}"
        }
      }
      cleanWs()
    }
  }
}