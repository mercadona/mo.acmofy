#!groovy

@Library('mercadonaonline')
import org.mercadonaonline.SlackNotifications
import org.mercadonaonline.StatusTesters
import org.mercadonaonline.Registry
import org.mercadonaonline.General

def slack = new SlackNotifications(this)
def tester = new StatusTesters(this)
def registry = new Registry(this)
def general = new General(this)

node {
    general.checkoutWithTags()
}

pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '1'))
    }

    environment {
        BUILD_WORKSPACE = "${env.WORKSPACE.replace(env.JENKINS_JOBS, '/var/jenkins_home/jobs')}"
        DOCKER_CONTEXT_WORKSPACE = "${env.WORKSPACE}"
        NODE_IMAGE = "eu.gcr.io/itg-mimercadona/node:16.14.0-1.0.0"
    }

    stages {

        stage ('Preparations') {
            steps {
                script {
                    slack.initializeGitVariables()
                    k8sEnvironment = 'staging'
                    k8sShortNamespace = 'sta'
                    associatedGitTag = general.getAssociatedTag()
                    imageTag = registry.getImageTag()
                    env.NODE_IMAGE_VERSION = imageTag
                    env.ZENDESK_SUBDOMAIN = "mercadona1523539178"
                    env.ZENDESK_CREDENTIALS_ID = "zendesk-sta-user-token"

                    isProduction = env.TAG_NAME != null
                    isStaging = env.BRANCH_NAME == 'master'
                    isPR = env.CHANGE_BRANCH != null

                    if (isProduction) {
                        imageTag = general.getAssociatedTag()
                        env.NODE_IMAGE_VERSION = imageTag
                        k8sEnvironment = 'production'
                        k8sShortNamespace = 'prod'
                        env.ZENDESK_SUBDOMAIN = "mercadona"
                        env.ZENDESK_CREDENTIALS_ID = "zendesk-prod-user-token"
                    }

                    env.GID = sh(returnStdout: true, script: 'id -g $USER').trim()
                    env.UID = sh(returnStdout: true, script: 'id -u $USER').trim()
                    sh 'env'
                }
            }
        }

        stage ('Install dependencies') {
            steps {
                script {
                    sh 'docker login -u _json_key -p "$(cat $HOME/.gcp/gcp.json)" https://eu.gcr.io'
                    sh """
                        docker run --rm -m=4g \
                            -v $JENKINS_JOBS:/var/jenkins_home/jobs \
                            -e CI=true \
                            --user node:node \
                            --workdir $BUILD_WORKSPACE \
                            --name $BUILD_TAG-install \
                                $NODE_IMAGE npm install --no-optional --registry http://172.21.97.98
                    """
                }
            }
        }

        stage ('Tests') {
            when {
                expression {
                    (isPR || isStaging)
                }
            }
            steps {
                script {
                    sh """
                        docker run --rm -m=4g \
                            -v $JENKINS_JOBS:/var/jenkins_home/jobs \
                            -e NODE_ENV='jenkins' \
                            -e CI=true \
                            -e NODE_IMAGE_VERSION=$NODE_IMAGE_VERSION \
                            --user node:node \
                            --workdir $BUILD_WORKSPACE \
                            --name $BUILD_TAG-build $NODE_IMAGE \
                                npm run test
                    """
                }
            }
            post {
                always {
                    script {
                        // Required for archiving
                        general.restoreFilePermissions(env.BUILD_WORKSPACE, env.UID, env.GID)
                        general.setStatusFromTestResults()
                    }
                }
            }
        }

        stage ('Build staging') {
            when {
                expression {
                    (isPR || isStaging)
                }
            }
            steps {
                script {
                    sh """
                        docker run --rm -m=4g \
                            -v $JENKINS_JOBS:/var/jenkins_home/jobs \
                            -e NODE_ENV='jenkins' \
                            -e CI=true \
                            -e NODE_IMAGE_VERSION=$NODE_IMAGE_VERSION \
                            --user node:node \
                            --workdir $BUILD_WORKSPACE \
                            --name $BUILD_TAG-build $NODE_IMAGE \
                                npm run build:sta
                    """
                }
            }
        }

        stage ('Build production') {
            when {
                expression {
                    (isProduction)
                }
            }
            steps {
                script {
                    sh """
                        docker run --rm -m=4g \
                            -v $JENKINS_JOBS:/var/jenkins_home/jobs \
                            -e NODE_ENV='jenkins' \
                            -e CI=true \
                            -e NODE_IMAGE_VERSION=$NODE_IMAGE_VERSION \
                            --user node:node \
                            --workdir $BUILD_WORKSPACE \
                            --name $BUILD_TAG-build $NODE_IMAGE \
                                npm run build
                    """
                }
            }
        }

        stage ('Publish') {
            when {
                expression {
                    (isStaging || isProduction)
                }
            }
            steps {
                script {
                    echo "Tagging image with tag: " + "${imageTag}"
                    withCredentials([
                        usernamePassword(
                            credentialsId:"${ZENDESK_CREDENTIALS_ID}", 
                            usernameVariable:"ZENDESK_USERNAME",
                            passwordVariable:"ZENDESK_API_TOKEN"
                            ),
                    ]){
                        sh """
                        docker run --rm -m=4g \
                            -v $JENKINS_JOBS:/var/jenkins_home/jobs \
                            -e NODE_ENV='jenkins' \
                            -e CI=true \
                            -e NODE_IMAGE_VERSION=$NODE_IMAGE_VERSION \
                            -e ZENDESK_SUBDOMAIN=${ZENDESK_SUBDOMAIN} \
                            -e ZENDESK_EMAIL=${ZENDESK_USERNAME} \
                            -e ZENDESK_API_TOKEN=${ZENDESK_API_TOKEN} \
                            --user node:node \
                            --workdir $BUILD_WORKSPACE \
                            --name $BUILD_TAG-build $NODE_IMAGE \
                                npx -p @zendesk/zcli zcli apps:update dist
                    """
                    }
                }
            }
        }


        stage('Changelog') {
            when {
                expression {
                    (isProduction)
                }
            }
            steps {
                script {
                    checkout(
                        [
                            $class: 'GitSCM',
                            branches: [[name: '*/master']],
                            doGenerateSubmoduleConfigurations: false,
                            extensions: [[$class: 'RelativeTargetDirectory',
                                   relativeTargetDir: 'devtools']],
                            submoduleCfg: [],
                            userRemoteConfigs: [[
                                url: 'https://github.com/mercadona/mercadona.online.devtools.git',
                                credentialsId:'hacendabot-user-token'
                            ]]
                        ]
                    )

                    withEnv(['PROJECT_NAME=acmofy']) {
                        changelog = sh(
                            returnStdout: true,
                            script: "./devtools/generate_changelog_by_topic.sh"
                        ).trim()
                    }

                    general.sendReleaseToGithub(associatedGitTag, changelog)
                }
            }
        }
    }

    post {
        always {
            script {
                def removeImage = null
                general.restoreFilePermissions(env.BUILD_WORKSPACE, env.UID, env.GID)
                general.cleanEnvironment(removeImage)
            }
            script {
                slack.finalNotify('#mercadona_online_web', tester.testStatuses())
            }
        }
    }
}
