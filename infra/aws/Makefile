.RECIPEPREFIX := >

build-BackendFunction:
>python -m pip install --upgrade pip
>python -m pip install -r requirements.lambda.txt -t "$(ARTIFACTS_DIR)"
>cp -R ../../backend_fastapi/app "$(ARTIFACTS_DIR)/app"
>cp -R ../../public "$(ARTIFACTS_DIR)/public"
>cp -R ../../infra "$(ARTIFACTS_DIR)/infra"
>cp lambda_handler.py "$(ARTIFACTS_DIR)/lambda_handler.py"
