#!/bin/bash
# ==============================================================================
# EcoRoute AI — AWS EC2 Launch Template User Data Bootstrap Script
# Target OS: Ubuntu Server 22.04 LTS (HVM)
# ==============================================================================
set -e

# Update and install system dependencies
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y python3-pip python3-venv git nginx awscli curl

# Setup application directory
mkdir -p /opt/ecoroute
cd /opt/ecoroute

# In a live deployment, clone the code repository or pull from S3 release bundle:
# git clone https://github.com/YourUsername/ecoroute-ai.git .
# For automated setup, ensure python venv is created:
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip

# Install project dependencies
pip install fastapi uvicorn pydantic pydantic-settings sqlalchemy psycopg2-binary boto3 ortools pillow pyjwt bcrypt

# Generate Production Environment Configuration
cat << 'EOF' > /opt/ecoroute/.env
ENVIRONMENT=production
APP_NAME="EcoRoute AI"
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS="*"

# Connect to Amazon RDS PostgreSQL:
DATABASE_URL=postgresql://postgres:YourSecureRDSMasterPassword@ecoroute-db.cxxxxxxx.us-east-1.rds.amazonaws.com:5432/ecoroutedb

# Storage configured for Amazon S3:
STORAGE_BACKEND=s3
S3_BUCKET_NAME=ecoroute-waste-photos-bucket
AWS_REGION=us-east-1

# IAM Role attached to EC2 provides credentials automatically; leave keys empty:
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

JWT_SECRET=production-secure-32-byte-token-ecoroute-cloud
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

ADMIN_EMAIL=admin@ecoroute.local
ADMIN_PASSWORD=AdminSecurePass123!

DEPOT_LATITUDE=12.9716
DEPOT_LONGITUDE=77.5946
DEPOT_NAME="Central Municipal Waste Depot"
EOF

# Install systemd service for FastAPI Uvicorn
cat << 'EOF' > /etc/systemd/system/ecoroute.service
[Unit]
Description=EcoRoute AI FastAPI Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/opt/ecoroute
EnvironmentFile=/opt/ecoroute/.env
ExecStart=/opt/ecoroute/venv/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 2
Restart=always
StandardOutput=append:/var/log/ecoroute.log
StandardError=append:/var/log/ecoroute.log

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ecoroute.service
systemctl start ecoroute.service

echo "EcoRoute AI bootstrap complete. Health check available at http://localhost:8000/health"
