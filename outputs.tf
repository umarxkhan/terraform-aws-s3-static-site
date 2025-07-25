output "website_url" {
  value = aws_s3_bucket_website_configuration.static_site_config.website_endpoint
}
