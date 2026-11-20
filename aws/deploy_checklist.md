# EcoRoute AI — AWS Cloud Deployment & Demonstration Checklist

This checklist guides engineering students through deploying **EcoRoute AI** onto Amazon Web Services (AWS) using Free-Tier compatible configurations.

---

## Pre-Deployment Preparation
- [ ] AWS Account active with administrator privileges.
- [ ] AWS CLI configured locally (`aws configure`).
- [ ] AWS Budget set to **$10.00 USD** with email alarm at 80% threshold.

---

## 1. Network & VPC Setup
- [ ] Create VPC: `ecoroute-vpc` (CIDR: `10.0.0.0/16`).
- [ ] Create Subnets across two Availability Zones:
  - `public-1a` (`10.0.1.0/24`) in `us-east-1a`
  - `public-1b` (`10.0.2.0/24`) in `us-east-1b`
  - `private-db-1a` (`10.0.100.0/24`) in `us-east-1a`
  - `private-db-1b` (`10.0.200.0/24`) in `us-east-1b`
- [ ] Create & attach Internet Gateway: `ecoroute-igw`.
- [ ] Update Public Route Table: Add route `0.0.0.0/0` -> `ecoroute-igw`. Associate `public-1a` and `public-1b`.

---

## 2. Security Groups Matrix
- [ ] **ALB Security Group (`sg-ecoroute-alb`):**
  - Inbound: HTTP (80) from `0.0.0.0/0`
  - Inbound: HTTPS (443) from `0.0.0.0/0`
  - Outbound: All traffic
- [ ] **EC2 App Security Group (`sg-ecoroute-app`):**
  - Inbound: TCP Port 8000 from `sg-ecoroute-alb`
  - Inbound: SSH (22) from your IP only (or use AWS Systems Manager Session Manager)
  - Outbound: All traffic (for S3, pip, and apt updates)
- [ ] **RDS DB Security Group (`sg-ecoroute-db`):**
  - Inbound: PostgreSQL (5432) only from `sg-ecoroute-app`
  - Outbound: None needed

---

## 3. Storage & Database Setup
- [ ] **Amazon S3 Bucket:**
  - Bucket name: `ecoroute-waste-photos-<unique-id>`
  - Region: `us-east-1`
  - Block Public Access: Enabled (secure access via backend API / presigned URLs)
  - Enable default SSE-S3 encryption
- [ ] **Amazon RDS for PostgreSQL:**
  - DB Subnet Group: Include `private-db-1a` and `private-db-1b`
  - Engine: PostgreSQL 15 or 16
  - Template: Free Tier
  - Instance Class: `db.t3.micro`
  - Storage: 20 GB gp2 (Allocated)
  - Master Username: `postgres`
  - Master Password: (Record securely; inject into EC2 environment)
  - Security Group: `sg-ecoroute-db`
  - Initial DB Name: `ecoroutedb`

---

## 4. IAM Instance Role
- [ ] Create IAM Role: `EcoRoute-EC2-Instance-Role`
  - Service: EC2
  - Attached Policies:
    - `CloudWatchAgentServerPolicy`
    - Custom inline policy or `AmazonS3FullAccess` scoped to `ecoroute-waste-photos-*`

---

## 5. EC2 Launch Template & Target Group
- [ ] **Target Group (`ecoroute-tg`):**
  - Target Type: Instances
  - Protocol: HTTP, Port: 8000
  - Health Check Path: `/health`
  - Healthy threshold: 2, Unhealthy threshold: 3, Interval: 15s
- [ ] **Launch Template (`ecoroute-launch-template`):**
  - AMI: Ubuntu Server 22.04 LTS (HVM)
  - Instance Type: `t3.micro` (Free Tier eligible)
  - IAM Profile: `EcoRoute-EC2-Instance-Role`
  - Security Group: `sg-ecoroute-app`
  - User Data: Copy from `aws/user_data.sh` with your RDS endpoint and S3 bucket name.

---

## 6. Application Load Balancer & Auto Scaling Group
- [ ] **Application Load Balancer (`ecoroute-alb`):**
  - Scheme: Internet-facing, IPv4
  - Subnets: `public-1a` and `public-1b`
  - Security Group: `sg-ecoroute-alb`
  - Listener: HTTP (80) forwarding to `ecoroute-tg`
- [ ] **Auto Scaling Group (`ecoroute-asg`):**
  - Launch Template: `ecoroute-launch-template`
  - VPC & Subnets: `public-1a` and `public-1b`
  - Load Balancer Target Group: Attach `ecoroute-tg`
  - Group size:
    - Minimum capacity: 1
    - Desired capacity: 1
    - Maximum capacity: 4
  - **Scaling Policy:**
    - Policy Type: Target Tracking Scaling Policy
    - Metric: `ASGAverageCPUUtilization`
    - Target Value: `60.0%`
    - Warmup: 120 seconds

---

## 7. CloudWatch Telemetry & Alarm Demonstration
- [ ] **CloudWatch Alarm:**
  - Name: `ecoroute-high-cpu-alarm`
  - Metric: `AWS/EC2 CPUUtilization` > 60% for 1 minute
  - Actions: Send email notification via Amazon SNS topic `ecoroute-admin-alerts`
- [ ] **Simulate Elastic Scaling (Viva Demonstration):**
  ```bash
  # Send 50,000 synthetic HTTP requests through the ALB:
  ab -n 50000 -c 80 http://ecoroute-alb-XXXXXXXXX.us-east-1.elb.amazonaws.com/health
  ```
  - Open AWS CloudWatch Metrics -> observe CPU spike past 60%.
  - Open EC2 Console -> observe Auto Scaling Group automatically spawning a 2nd instance.
  - Stop load generator -> observe Auto Scaling Group terminating extra instance back to 1.

---

## 8. Post-Evaluation Teardown (Prevent Unintended Charges)
- [ ] Delete Application Load Balancer.
- [ ] Set Auto Scaling Group Desired & Min capacity to 0, then delete ASG.
- [ ] Delete EC2 Launch Template.
- [ ] Terminate Amazon RDS PostgreSQL instance (disable final snapshot).
- [ ] Empty and delete S3 Bucket.
- [ ] Verify billing dashboard shows $0.00 accrued.
