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
    CYPRESS_DEV_USERNAME           = credentials('CYPRESS_TEST_USERNAME')
    CYPRESS_DEV_USERNAME2          = credentials('CYPRESS_TEST_USERNAME2')
    CYPRESS_DEV_USERNAME3          = credentials('CYPRESS_TEST_USERNAME3')
    CYPRESS_DEV_PASSWORD           = credentials('CYPRESS_TEST_PASSWORD')
    CYPRESS_DEV_PASSWORD2          = credentials('CYPRESS_TEST_PASSWORD2')
    CYPRESS_DEV_PASSWORD3          = credentials('CYPRESS_TEST_PASSWORD3')
    CYPRESS_DEV_ALT_USERNAME       = credentials('CYPRESS_TEST_ALT_USERNAME')
    CYPRESS_DEV_ALT_USERNAME2      = credentials('CYPRESS_TEST_ALT_USERNAME2')
    CYPRESS_DEV_ALT_USERNAME3      = credentials('CYPRESS_TEST_ALT_USERNAME3')
    CYPRESS_DEV_ALT_PASSWORD       = credentials('CYPRESS_TEST_ALT_PASSWORD')
    CYPRESS_DEV_ALT_PASSWORD2      = credentials('CYPRESS_TEST_ALT_PASSWORD2')
    CYPRESS_DEV_ALT_PASSWORD3      = credentials('CYPRESS_TEST_ALT_PASSWORD3')
    CYPRESS_DEV_MEASURESHARING_API_KEY    = credentials('CYPRESS_DEV_MEASURESHARING_API_KEY')
    CYPRESS_DEV_DELETEMEASUREADMIN_API_KEY = credentials('CYPRESS_DEV_DELETEMEASUREADMIN_API_KEY')
    CYPRESS_DEV_ADMIN_API_KEY      = credentials('CYPRESS_DEV_ADMIN_API_KEY')
    CYPRESS_TEST_USERNAME          = credentials('CYPRESS_TEST_USERNAME')
    CYPRESS_TEST_USERNAME2         = credentials('CYPRESS_TEST_USERNAME2')
    CYPRESS_TEST_USERNAME3         = credentials('CYPRESS_TEST_USERNAME3')
    CYPRESS_TEST_PASSWORD          = credentials('CYPRESS_TEST_PASSWORD')
    CYPRESS_TEST_PASSWORD2         = credentials('CYPRESS_TEST_PASSWORD2')
    CYPRESS_TEST_PASSWORD3         = credentials('CYPRESS_TEST_PASSWORD3')
    CYPRESS_TEST_ALT_USERNAME      = credentials('CYPRESS_TEST_ALT_USERNAME')
    CYPRESS_TEST_ALT_USERNAME2     = credentials('CYPRESS_TEST_ALT_USERNAME2')
    CYPRESS_TEST_ALT_USERNAME3     = credentials('CYPRESS_TEST_ALT_USERNAME3')
    CYPRESS_TEST_ALT_PASSWORD      = credentials('CYPRESS_TEST_ALT_PASSWORD')
    CYPRESS_TEST_ALT_PASSWORD2     = credentials('CYPRESS_TEST_ALT_PASSWORD2')
    CYPRESS_TEST_ALT_PASSWORD3     = credentials('CYPRESS_TEST_ALT_PASSWORD3')
    CYPRESS_TEST_MEASURESHARING_API_KEY   = credentials('CYPRESS_TEST_MEASURESHARING_API_KEY')
    CYPRESS_TEST_DELETEMEASUREADMIN_API_KEY = credentials('CYPRESS_TEST_DELETEMEASUREADMIN_API_KEY')
    CYPRESS_TEST_ADMIN_API_KEY     = credentials('CYPRESS_TEST_ADMIN_API_KEY')
    CYPRESS_IMPL_USERNAME          = credentials('CYPRESS_IMPL_USERNAME')
    CYPRESS_IMPL_PASSWORD          = credentials('CYPRESS_IMPL_PASSWORD')
    CYPRESS_IMPL_ALT_USERNAME      = credentials('CYPRESS_IMPL_ALT_USERNAME')
    CYPRESS_IMPL_ALT_PASSWORD      = credentials('CYPRESS_IMPL_ALT_PASSWORD')
    CYPRESS_VSAC_API_KEY           = credentials('CYPRESS_VSAC_API_KEY')
    CYPRESS_DEV_MADIE_CLIENTID     = credentials('CYPRESS_DEV_MADIE_CLIENTID')
    CYPRESS_DEV_MADIE_CODECHALLENGE= credentials('CYPRESS_DEV_MADIE_CODECHALLENGE')
    CYPRESS_DEV_MADIE_REDIRECTURI  = credentials('CYPRESS_DEV_MADIE_REDIRECTURI')
    CYPRESS_DEV_MADIE_AUTHURI      = credentials('CYPRESS_DEV_MADIE_AUTHURI')
    CYPRESS_MADIE_CODEVERIFIER     = credentials('CYPRESS_MADIE_CODEVERIFIER')
    CYPRESS_TEST_MADIE_CLIENTID    = credentials('CYPRESS_TEST_MADIE_CLIENTID')
    CYPRESS_TEST_MADIE_REDIRECTURI = credentials('CYPRESS_TEST_MADIE_REDIRECTURI')
    CYPRESS_TEST_MADIE_AUTHURI     = credentials('CYPRESS_TEST_MADIE_AUTHURI')
    CYPRESS_IMPL_MADIE_CLIENTID    = credentials('CYPRESS_IMPL_MADIE_CLIENTID')
    CYPRESS_IMPL_MADIE_REDIRECTURI = credentials('CYPRESS_IMPL_MADIE_REDIRECTURI')
    CYPRESS_IMPL_MADIE_AUTHURI     = credentials('CYPRESS_IMPL_MADIE_AUTHURI')
    CYPRESS_IMPL_MEASURESHARING_API_KEY  = credentials('CYPRESS_IMPL_MEASURESHARING_API_KEY')
    CYPRESS_IMPL_DELETEMEASUREADMIN_API_KEY = credentials('CYPRESS_IMPL_DELETEMEASUREADMIN_API_KEY')
    CYPRESS_IMPL_ADMIN_API_KEY     = credentials('CYPRESS_IMPL_ADMIN_API_KEY')
    CYPRESS_REPORT_BUCKET          = credentials('CYPRESS_REPORT_BUCKET')
    NODE_OPTIONS                   = credentials('NODE_OPTIONS')
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
        // Install deps into ${WORKSPACE} so CLIs (cypress-parallel/marge) are available
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
            npm run delete:reports            # clean result JSONs for a clean initial report
            npm run $TEST_SCRIPT
            echo $?
          '''
        }

        // Initial failures for reruns (newline-separated)
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

        // Initial report bundle
        sh '''
          cd ${WORKSPACE}
          if ls ${WORKSPACE}/cypress/results/*.json >/dev/null 2>&1; then
            npm run combine:reports
            npx marge mochawesome.json --reportDir ${WORKSPACE}/mochawesome-initial --reportFilename index.html
            tar -czf ${WORKSPACE}/mochawesome-initial-${BUILD_NUMBER}.tar.gz -C ${WORKSPACE}/mochawesome-initial .
          else
            echo "No mochawesome JSON for initial run; skipping initial report generation."
            : > ${WORKSPACE}/mochawesome-initial-${BUILD_NUMBER}.tar.gz || true
          fi
        '''

        // Pre-create empty rerun files so they always archive
        sh '''
          : > ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt
          : > ${WORKSPACE}/failures-rerun2-${BUILD_NUMBER}.txt
        '''

        archiveArtifacts artifacts: "mochawesome-initial-${env.BUILD_NUMBER}.tar.gz, failures-${env.BUILD_NUMBER}.txt, failures-rerun1-${env.BUILD_NUMBER}.txt, failures-rerun2-${env.BUILD_NUMBER}.txt", onlyIfSuccessful: false
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
          else
            echo '=== RERUN #1 ==='
            npm run delete:reports

            : > ${WORKSPACE}/test-files.txt
            cat ${WORKSPACE}/failures-${BUILD_NUMBER}.txt > ${WORKSPACE}/test-files.txt

            rm -rf ${WORKSPACE}/runner-results/* || true
            mkdir -p ${WORKSPACE}/runner-results
            npm run test:specific:files:parallel || true

            # Collect failures after rerun #1
            if ls ${WORKSPACE}/runner-results/*.json >/dev/null 2>&1; then
              cat ${WORKSPACE}/runner-results/*.json \
                | jq -r 'select(.failures > 0) | .file' \
                | sed '/^null$/d' \
                > ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt
            else
              : > ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt
            fi

            # Bundle rerun1 report
            if ls ${WORKSPACE}/cypress/results/*.json >/dev/null 2>&1; then
              npm run combine:reports
              npx marge mochawesome.json --reportDir ${WORKSPACE}/mochawesome-rerun1 --reportFilename index.html
              tar -czf ${WORKSPACE}/mochawesome-rerun1-${BUILD_NUMBER}.tar.gz -C ${WORKSPACE}/mochawesome-rerun1 .
            else
              echo "No mochawesome JSON for rerun1; skipping rerun1 report."
              : > ${WORKSPACE}/mochawesome-rerun1-${BUILD_NUMBER}.tar.gz || true
            fi

            if [ -s ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt ]; then
              echo '=== RERUN #2 ==='
              npm run delete:reports

              : > ${WORKSPACE}/test-files.txt
              cat ${WORKSPACE}/failures-rerun1-${BUILD_NUMBER}.txt > ${WORKSPACE}/test-files.txt

              rm -rf ${WORKSPACE}/runner-results/* || true
              mkdir -p ${WORKSPACE}/runner-results
              npm run test:specific:files:parallel || true

              # Collect failures after rerun #2
              if ls ${WORKSPACE}/runner-results/*.json >/dev/null 2>&1; then
                cat ${WORKSPACE}/runner-results/*.json \
                  | jq -r 'select(.failures > 0) | .file' \
                  | sed '/^null$/d' \
                  > ${WORKSPACE}/failures-rerun2-${BUILD_NUMBER}.txt
              else
                : > ${WORKSPACE}/failures-rerun2-${BUILD_NUMBER}.txt
              fi

              # Bundle rerun2 report
              if ls ${WORKSPACE}/cypress/results/*.json >/dev/null 2>&1; then
                npm run combine:reports
                npx marge mochawesome.json --reportDir ${WORKSPACE}/mochawesome-rerun2 --reportFilename index.html
                tar -czf ${WORKSPACE}/mochawesome-rerun2-${BUILD_NUMBER}.tar.gz -C ${WORKSPACE}/mochawesome-rerun2 .
              else
                echo "No mochawesome JSON for rerun2; skipping rerun2 report."
                : > ${WORKSPACE}/mochawesome-rerun2-${BUILD_NUMBER}.tar.gz || true
              fi
            else
              # ensure rerun2 tar exists even if rerun2 did not run
              : > ${WORKSPACE}/mochawesome-rerun2-${BUILD_NUMBER}.tar.gz || true
            fi
          fi
        '''

        archiveArtifacts artifacts: "mochawesome-rerun1-${env.BUILD_NUMBER}.tar.gz, mochawesome-rerun2-${env.BUILD_NUMBER}.tar.gz, failures-${env.BUILD_NUMBER}.txt, failures-rerun1-${env.BUILD_NUMBER}.txt, failures-rerun2-${env.BUILD_NUMBER}.txt", onlyIfSuccessful: false
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
        // Nothing to generate here; per-run bundles created earlier.
        archiveArtifacts artifacts: "mochawesome-initial-${env.BUILD_NUMBER}.tar.gz, mochawesome-rerun1-${env.BUILD_NUMBER}.tar.gz, mochawesome-rerun2-${env.BUILD_NUMBER}.tar.gz, failures-${env.BUILD_NUMBER}.txt, failures-rerun1-${env.BUILD_NUMBER}.txt, failures-rerun2-${env.BUILD_NUMBER}.txt", onlyIfSuccessful: false
      }
    }
  }

  // --- Single, final Slack decision & cleanup (Groovy-only; no `sh`) ---
  post {
    always {
      script {
        try {
          // File paths
          String f0 = "${env.WORKSPACE}/failures-${env.BUILD_NUMBER}.txt"
          String f1 = "${env.WORKSPACE}/failures-rerun1-${env.BUILD_NUMBER}.txt"
          String f2 = "${env.WORKSPACE}/failures-rerun2-${env.BUILD_NUMBER}.txt"

          // Read (if exists) and count non-empty trimmed lines
          def readLinesSafe = { String p ->
            fileExists(p) ? readFile(p).readLines().findAll { it?.trim() } : []
          }
          List l0 = readLinesSafe(f0)
          List l1 = readLinesSafe(f1)
          List l2 = readLinesSafe(f2)

          int c0 = l0.size()
          int c1 = l1.size()
          int c2 = l2.size()

          // Success rule
          boolean passed = (c0 == 0) || (c0 > 0 && c1 == 0) || (c1 > 0 && c2 == 0)

          // Outcome text
          String how =
            (c0 == 0) ? "✅ Passed on the initial run." :
            (c1 == 0) ? "✅ Passed after the 1st rerun. (initial: ${c0})" :
            (c2 == 0) ? "✅ Passed after the 2nd rerun. (initial: ${c0}, after rerun1: ${c1})"
                       : "❌ Still failing after the 2nd rerun."

          String title = passed ? "All test cases passed" : "Failures remain after 2nd rerun"
          String color = passed ? "#36a64f" : "#ff0000"

          // Artifact URLs
          def artUrl = { fn -> "${env.BUILD_URL}artifact/${fn}" }
          String urlInit = artUrl("mochawesome-initial-${env.BUILD_NUMBER}.tar.gz")
          String urlR1   = artUrl("mochawesome-rerun1-${env.BUILD_NUMBER}.tar.gz")
          String urlR2   = artUrl("mochawesome-rerun2-${env.BUILD_NUMBER}.tar.gz")

          // Top N failing specs after rerun #2 (format for Slack JSON)
          int TOP_N = 10
          List<String> topList = l2.take(TOP_N)
          String topJoined = topList ? topList.join('\n') : 'None 🎉'
          // Escape for JSON
          topJoined = topJoined
            .replace("\\", "\\\\")
            .replace("\n", "\\n")
            .replace("\"", "\\\"")

          String attachments = """
          [
            {
              "fallback": "${env.JOB_NAME} #${env.BUILD_NUMBER}: ${title}",
              "color": "${color}",
              "title": "${env.JOB_NAME} #${env.BUILD_NUMBER}: ${title}",
              "title_link": "${env.BUILD_URL}",
              "fields": [
                { "title": "Outcome",             "value": "${how}",                        "short": false },
                { "title": "Initial failures",    "value": "${c0}",                         "short": true  },
                { "title": "After rerun #1",      "value": "${c1}",                         "short": true  },
                { "title": "After rerun #2",      "value": "${c2}",                         "short": true  },
                { "title": "Reports",             "value": "<${urlInit}|initial> | <${urlR1}|rerun1> | <${urlR2}|rerun2>", "short": false },
                { "title": "Top failing specs (after rerun #2)", "value": "${topJoined}",  "short": false }
              ],
              "footer": "MADiE CI",
              "ts": ${System.currentTimeMillis()/1000L}
            }
          ]
          """.stripIndent().trim()

          currentBuild.result = passed ? 'SUCCESS' : 'FAILURE'

          slackSend(
            color: color,
            attachments: attachments
          )
        } catch (e) {
          // Never fail the post block; just log
          echo "Post summary/Slack failed: ${e}"
        }
      }

      // Clean workspace last
      cleanWs()
    }
  }
}