#!/usr/bin/env bash
# exit on error
set -o errexit

# Python bağımlılıklarını kur
pip install -r ai_service/requirements.txt

# Frontend için gerekirse node bağımlılıkları kurulabilir
# npm --prefix frontend install 