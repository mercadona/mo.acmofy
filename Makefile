#!/usr/bin/make -f

PROJECT_NAME := acmofy

changelog: ## Generate changelog for current release
	@PROJECT_NAME=$(PROJECT_NAME) git_generate_changelog_by_topic

prepare-deploy: ## Create tag for next release, generate changelog and open tag on jenkins
	remove_old_tags
	@PROJECT_NAME=$(PROJECT_NAME) mercadona_prepare_deploy_without_hash

help: ## Display this help text
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
