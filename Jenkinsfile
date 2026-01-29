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
    CYPRESS_DEV_MEASURESHARING_API_KEY    = credentials('CYPRESS_DEV_MEASURESHARING_API_KEY')
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
    CYPRESS_TEST_MEASURESHARING_API_KEY   = credentials('CYPRESS_TEST_MEASURESHARING_API_KEY')
    CYPRESS_TEST_DELETEMEASUREADMIN_API_KEY = credentials('CYPRESS_TEST_DELETEMEASUREADMIN_API_KEY')
    CYPRESS_TEST_ADMIN_API_KEY      = credentials('CYPRESS_TEST_ADMIN_API_KEY')

    // ---------- IMPL creds ----------
    CYPRESS_IMPL_USERNAME           = credentials('CYPRESS_IMPL_USERNAME')
    CYPRESS_IMPL_PASSWORD           = credentials('CYPRESS_IMPL_PASSWORD')
    CYPRESS_IMPL_ALT_USERNAME       = credentials('CYPRESS_IMPL_ALT_USERNAME')
    CYPRESS_IMPL_ALT_PASSWORD       = credentials('CYPRESS_IMPL_ALT_PASSWORD')
    CYPRESS_IMPL_MEASURESHARING_API_KEY   = credentials('CYPRESS_IMPL_MEASURESHARING_API_KEY')
    CYPRESS_IMPL_DELETEMEASUREADMIN_API_KEY = credentials('CYPRESS_IMPL_DELETEMEASUREADMIN_API_KEY')
    CYPRESS_IMPL_ADMIN_API_KEY      = credentials('CYPRESS_IMPL_ADMIN_API_KEY')

    // ---------- VSAC ----------
    CYPRESS_VSAC_API_KEY            = credentials('CYPRESS_VSAC_API_KEY')

    // ---------- MADiE OAuth (DEV/TEST/IMPL) ----------
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
        // Ensure node_modules in ${WORKSPACE}
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
            # Clean prior run JSONs once at the start (keep results across reruns)
            npm run delete:reports
            npm run $TEST_SCRIPT
            echo $?
          '''
        }

        // Initial failures for rerun #1 (newline-separated)
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
          # Pre-create rerun files so they always publish
          : > ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt
          : > ${WORKSPACE}/failures-rerun2-${BUILD_NUMBER}.txt
        '''

        archiveArtifacts artifacts: "failures-${env.BUILD_NUMBER}.txt, failures-rerun1-${env.BUILD_NUMBER}.txt, failures-rerun2-${env.BUILD_NUMBER}.txt", onlyIfSuccessful: false
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
            exit 0
          fi

          echo '=== RERUN #1 ==='
          # Do NOT delete cypress/results here; we merge all runs at the end
          : > ${WORKSPACE}/test-files.txt
          cat ${WORKSPACE}/failures-${BUILD_NUMBER}.txt > ${WORKSPACE}/test-files.txt

          rm -rf ${WORKSPACE}/runner-results/* || true
          mkdir -p ${WORKSPACE}/runner-results
          npm run test:specific:files:parallel || true

          # Failures for RERUN #2
          if ls ${WORKSPACE}/runner-results/*.json >/dev/null 2>&1; then
            cat ${WORKSPACE}/runner-results/*.json \
              | jq -r 'select(.failures > 0) | .file' \
              | sed '/^null$/d' \
              > ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt
          else
            : > ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt
          fi

          if [ ! -s ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt ]; then
            echo 'No failures left after RERUN #1 – skipping RERUN #2.'
            exit 0
          fi

          echo '=== RERUN #2 ==='
          : > ${WORKSPACE}/test-files.txt
          cat ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt > ${WORKSPACE}/test-files.txt

          rm -rf ${WORKSPACE}/runner-results/* || true
          mkdir -p ${WORKSPACE}/runner-results
          npm run test:specific:files:parallel || true

          # Remaining failures after RERUN #2
          if ls ${WORKSPACE}/runner-results/*.json >/dev/null 2>&1; then
            cat ${WORKSPACE}/runner-results/*.json \
              | jq -r 'select(.failures > 0) | .file' \
              | sed '/^null$/d' \
              > ${WORKSPACE}/failures-rerun2-${BUILD_NUMBER}.txt
          else
            : > ${WORKSPACE}/failures-rerun2-${BUILD_NUMBER}.txt
          fi
        '''

        archiveArtifacts artifacts: "failures-${env.BUILD_NUMBER}.txt, failures-rerun1-${env.BUILD_NUMBER}.txt, failures-rerun2-${env.BUILD_NUMBER}.txt", onlyIfSuccessful: false
      }
    }

    stage('Reports (single merged)') {
      agent {
        docker {
          image "${env.AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com/madie-dev-cypress-ecr:latest"
          args "-u 0 -v $HOME/.npm:/.npm"
          reuseNode true
        }
      }
      steps {
        // Merge *all* JSONs across all runs & build one HTML bundle
        sh '''
          cd ${WORKSPACE}
          if ls ${WORKSPACE}/cypress/results/*.json >/dev/null 2>&1; then
            npx mochawesome-merge 'cypress/results/*.json' > mochawesome.json
            npx marge mochawesome.json --reportDir ${WORKSPACE}/mochawesome-report --reportFilename index.html
            tar -czf ${WORKSPACE}/mochawesome-report-${BUILD_NUMBER}.tar.gz -C ${WORKSPACE}/mochawesome-report .
          else
            echo "No mochawesome JSON found; skipping report generation."
            : > ${WORKSPACE}/mochawesome-report-${BUILD_NUMBER}.tar.gz || true
          fi
        '''
        archiveArtifacts artifacts: "mochawesome-report-${env.BUILD_NUMBER}.tar.gz, failures-${env.BUILD_NUMBER}.txt, failures-rerun1-${env.BUILD_NUMBER}.txt, failures-rerun2-${env.BUILD_NUMBER}.txt", onlyIfSuccessful: false
      }
    }
  }

  // Single, final Slack summary (plain text; robust)
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

          int c0 = l0.size(), c1 = l1.size(), c2 = l2.size()

          boolean passed = (c0 == 0) || (c0 > 0 && c1 == 0) || (c1 > 0 && c2 == 0)

          String outcome =
            (c0 == 0) ? "✅ Passed on the initial run." :
            (c1 == 0) ? "✅ Passed after the 1st rerun. (initial: ${c0})" :
            (c2 == 0) ? "✅ Passed after the 2nd rerun. (initial: ${c0}, after rerun1: ${c1})"
                       : "❌ Still failing after the 2nd rerun."

          String msg = """\
${passed ? "All test cases passed" : "Failures remain after 2nd rerun"}
Outcome: ${outcome}

Counts:
• Initial failures: ${c0}
• After rerun #1:  ${c1}
• After rerun #2:  ${c2}

Report:
• ${env.BUILD_URL}artifact/mochawesome-report-${bn}.tar.gz

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