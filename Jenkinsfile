#!groovy

@Library('mercadonaonline')
import org.mercadonaonline.SlackNotifications
import org.mercadonaonline.StatusTesters
import org.mercadonaonline.Kubernetes
import org.mercadonaonline.Registry
import org.mercadonaonline.General
import org.mercadonaonline.Mercanetes

def slack = new SlackNotifications(this)
def tester = new StatusTesters(this)
def k8s = new Kubernetes(this)
def registry = new Registry(this)
def general = new General(this)
def metadata = new Mercanetes(this)

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
        // IMAGE_NAME = "shop-sd-web"
        BUILD_WORKSPACE = "${env.WORKSPACE.replace(env.JENKINS_JOBS, '/var/jenkins_home/jobs')}"
        DOCKER_CONTEXT_WORKSPACE = "${env.WORKSPACE}"
        NODE_IMAGE = "eu.gcr.io/itg-mimercadona/node:16.14.0-1.0.0"
        // DOCKER_IMAGE_NAME = 'shop-sd-web'
    }

    // parameters {
    //     choice(choices: ['Laboratory', 'Stable'], description: 'To which warehouse(colmena) group do you want to deploy?', name: 'branch')
    // }

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
                    // branch = params.branch.toLowerCase()
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
                    boilerplate_ui = null
                    sh """
                        docker run --rm -m=4g \
                            -v $JENKINS_JOBS:/var/jenkins_home/jobs \
                            -e NODE_ENV='jenkins' \
                            -e CI=true \
                            -e NODE_IMAGE_VERSION=$NODE_IMAGE_VERSION \
                            -e HOME=/home/node \
                            --workdir $BUILD_WORKSPACE \
                            --name $BUILD_TAG-build $NODE_IMAGE \
                                npm run build:sta
                    """
                            // -e DEPLOYMENT_CHANNEL=$branch \
                    // if (isProduction) {
                    //     boilerplate_ui = registry.build(env.IMAGE_NAME, ".", imageTag)
                    // } else {
                    //     boilerplate_ui = registry.build(env.IMAGE_NAME)
                    // }
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
                    boilerplate_ui = null
                    sh """
                        docker run --rm -m=4g \
                            -v $JENKINS_JOBS:/var/jenkins_home/jobs \
                            -e NODE_ENV='jenkins' \
                            -e CI=true \
                            -e NODE_IMAGE_VERSION=$NODE_IMAGE_VERSION \
                            -e HOME=/home/node \
                            --workdir $BUILD_WORKSPACE \
                            --name $BUILD_TAG-build $NODE_IMAGE \
                                npm run build
                    """
                            // -e DEPLOYMENT_CHANNEL=$branch \
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
                            --workdir $BUILD_WORKSPACE \
                            --name $BUILD_TAG-build $NODE_IMAGE \
                                npx -p @zendesk/zcli zcli apps:update dist
                    """
                    }
                            // -e DEPLOYMENT_CHANNEL=$branch \
                    
                    // registry.push(boilerplate_ui, imageTag)
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

        // stage ('Publish release in metadata') {
        //     when {
        //         expression {
        //             (isStaging || isProduction)
        //         }
        //     }
        //     steps {
        //         script {
        //             appName = "shop-sd-web"
        //             echo "Deploying to production image with tag: " + "${imageTag} and to the namespace: ${k8sEnvironment}"

        //             k8sEnvironment = "staging"

        //             if (isProduction) {
        //                 k8sEnvironment = "production"
        //                 imageTag = associatedGitTag
        //             }

        //             metadata.setMetadataEndpoint(k8sEnvironment)
        //             metadata.release(appName, imageTag, branch)
        //         }
        //     }
        //     post {
        //         success {
        //             script {
        //                 slack.kubernetesNotifySuccess(k8sEnvironment, imageTag)
        //             }
        //         }
        //         failure {
        //             script {
        //                 slack.kubernetesNotifyFailure(k8sEnvironment, imageTag)
        //             }
        //         }
        //     }
        // }

        // stage ('Docker Registry clean up') {
        //     when {
        //         expression {
        //             (isStaging)
        //         }
        //     }
        //     steps {
        //         script {
        //             registry.cleanup(env.IMAGE_NAME, 90)
        //         }
        //     }
        // }
    }

    post {
        always {
            script {
                def removeImage = null
                if (boilerplate_ui != null) {
                    removeImage = boilerplate_ui.id
                }
                general.restoreFilePermissions(env.BUILD_WORKSPACE, env.UID, env.GID)
                general.cleanEnvironment(removeImage)
            }
            script {
                slack.finalNotify('#mercadona_online_web', tester.testStatuses())
            }
        }
    }
}