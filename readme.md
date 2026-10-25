# Terraform AWS S3 Static Website

This repository provisions the personal portfolio of **Mubarak Ahmad Khan** — Full Stack Software Engineer & Cloud/DevOps Specialist (AWS Certified Solutions Architect).

The site is a static, dependency-free HTML/CSS/JS application (React showcased via the featured SaaS project) hosted on **S3 + CloudFront** and provisioned entirely with **Terraform**. Deployment is automated with **GitHub Actions**.

## Site structure

```
.
├── main.tf                    # S3 bucket, website config, policy, versioning, file uploads
├── variables.tf               # Variable definitions
├── outputs.tf                 # Outputs (bucket name, website endpoint)
├── site-content/              # Static site assets (uploaded by Terraform)
│   ├── index.html             # Home page (overhauled, dark-first design system)
│   ├── error.html             # CloudFront/S3 error page
│   ├── impressum.html         # Legal page (German)
│   ├── datenschutz.html       # Privacy page (German)
│   ├── job_pic.jpg            # Profile photo
│   ├── css/styles.css          # Design tokens (slate/navy + teal/cyan), dark/light themes
│   ├── js/main.js             # Theme toggle, nav, scroll spy, reveal, lightbox, contact form
│   └── images/                # Project screenshots & architecture diagrams
└── .github/workflows/deploy.yml  # CI/CD: sync to S3 + CloudFront invalidation
```

## Local testing

No build step is required — the site is vanilla HTML/CSS/JS. Open `site-content/index.html` directly in a browser, or serve it locally:

```bash
# Python 3
python -m http.server 8000 --directory site-content
# then open http://localhost:8000
```

> Note: the contact form posts to a live API Gateway endpoint, so submissions from `localhost` will already reach the existing backend.

## Deploying with Terraform

1. Set the bucket name:

   ```hcl
   # terraform.tfvars (create if missing)
   bucket_name = "your.globally.unique.bucket.name"
   ```

2. Initialize and apply:

   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

3. Terraform uploads every file under `site-content/` and prints the website endpoint.

## CI/CD (GitHub Actions)

`.github/workflows/deploy.yml` runs on every push to `main`:

- Syncs `site-content/` to S3 with `--delete`
- Appends the git commit hash to the profile image URL to bust browser caches
- Invalidates CloudFront (requires the `CLOUDFRONT_DISTRIBUTION_ID` secret)

Required repository secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and optionally `CLOUDFRONT_DISTRIBUTION_ID`.

## CloudFront

The S3 bucket is configured for public-read website hosting. When CloudFront fronts the bucket, the workflow's invalidation step clears the CDN cache on each deploy. For the strongest security posture, consider switching the bucket policy to CloudFront-only access via Origin Access Control (OAC) — see the [AWS Cloud Cost Calculator](https://github.com/umarxkhan/AWS-Cloud-Cost-Calculator) project for a reference implementation.

## Notes

- Bucket names must be globally unique.
- `aws_s3_bucket` uses `force_destroy = false` by default; the bucket and its contents are removed on `terraform destroy` only after emptying.
- Do **not** pass `--acl public-read` to `aws s3 sync` — the bucket policy handles public reads.
