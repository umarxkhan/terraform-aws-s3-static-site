# Terraform AWS S3 Static Website

This Terraform project provisions an AWS S3 bucket configured to host a static website.  
It uploads the content from the `site-content` directory and sets the bucket policy to allow public read access.

## Features

- Creates an S3 bucket with website hosting enabled  
- Configures index and error documents (`index.html` and `error.html`)  
- Sets public access policies to allow website access  
- Uploads static files from `site-content` folder  
- Outputs the website URL after deployment  
- Automates deployment to S3 using GitHub Actions  

## Prerequisites

- Terraform installed (v1.0+ recommended)  
- AWS CLI configured with appropriate credentials (for local use)  
- GitHub repository with GitHub Actions enabled (for CI/CD)  
- Unique S3 bucket name (S3 bucket names must be globally unique)  

## Usage

1. Update `terraform.tfvars` with the desired bucket name:
```hcl
bucket_name = "your.unique.bucket.name"
````

2. Initialize Terraform:

   ```bash
   terraform init
   ```

3. Review the execution plan:

   ```bash
   terraform plan
   ```

4. Apply the changes:

   ```bash
   terraform apply
   ```

5. After successful apply, the website URL will be displayed in the output:

   ```bash
   website_url = http://your.unique.bucket.name.s3-website-<region>.amazonaws.com
   ```

6. Open the URL in your browser to see your static website.

7. (Optional) Set up GitHub Secrets in your repository for AWS credentials and region:

   * `AWS_ACCESS_KEY_ID`
   * `AWS_SECRET_ACCESS_KEY`
   * `AWS_REGION`

8. Push your changes to the `main` branch to trigger GitHub Actions and deploy your site automatically.

## GitHub Actions Workflow

The `.github/workflows/deploy.yml` file uses GitHub Actions to sync your `site-content/` directory to the S3 bucket on every push to the `main` branch.
It uses the AWS credentials stored in GitHub Secrets and does **not** apply ACLs since the bucket policy handles permissions.

```yaml
name: Deploy Static Website to S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Sync website content to S3
        run: aws s3 sync site-content/ s3://your.unique.bucket.name --delete

      - name: Verify deployment
        run: aws sts get-caller-identity
```

## Structure

```
terraform-s3-static-site/
├── main.tf               # S3 bucket and website config resources
├── variables.tf          # Variable definitions
├── outputs.tf            # Outputs the website URL
├── terraform.tfvars      # Bucket name and other variable values
├── site-content/         # Static website files (index.html, error.html, etc.)
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions workflow for deployment
```

## Notes

* Make sure the bucket name is globally unique.
* The project sets `force_destroy = true` on the bucket, so the bucket and its contents will be deleted if you run `terraform destroy`.
* Do **not** use `--acl public-read` with `aws s3 sync` if your bucket has ACLs disabled (which is the current best practice).
* Use GitHub Secrets to store AWS credentials securely for the CI/CD pipeline.

---

## License

MIT License
