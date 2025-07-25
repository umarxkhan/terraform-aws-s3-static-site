# Terraform AWS S3 Static Website

This Terraform project provisions an AWS S3 bucket configured to host a static website.  
It uploads the content from the `site-content` directory and sets the bucket policy to allow public read access.

## Features

- Creates an S3 bucket with website hosting enabled  
- Configures index and error documents (`index.html` and `error.html`)  
- Sets public access policies to allow website access  
- Uploads static files from `site-content` folder  
- Outputs the website URL after deployment  

## Prerequisites

- Terraform installed (v1.0+ recommended)  
- AWS CLI configured with appropriate credentials  
- Unique S3 bucket name (S3 bucket names must be globally unique)  

## Usage

1. Update `terraform.tfvars` with the desired bucket name:

    ```
    bucket_name = "your.unique.bucket.name"
    ```

2. Initialize Terraform:

    ```
    terraform init
    ```

3. Review the execution plan:

    ```
    terraform plan
    ```

4. Apply the changes:

    ```
    terraform apply
    ```

5. After successful apply, the website URL will be displayed in the output:

    ```
    website_url = http://your.unique.bucket.name.s3-website-<region>.amazonaws.com
    ```

6. Open the URL in your browser to see your static website.

## Structure

````

terraform-s3-static-site/
├── main.tf               # S3 bucket and website config resources
├── variables.tf          # Variable definitions
├── outputs.tf            # Outputs the website URL
├── terraform.tfvars      # Bucket name and other variable values
├── site-content/         # Static website files (index.html, error.html, etc.)

```

## Notes

- Make sure the bucket name is globally unique.  
- The project sets `force_destroy = true` on the bucket, so the bucket and its contents will be deleted if you run `terraform destroy`.

---

## License

MIT License
```