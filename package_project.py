#!/usr/bin/env python3
import os
import zipfile
import tarfile

EXCLUDE_DIRS = {
    'node_modules',
    '.git',
    '.aistudio',
    '.cache',
    '__pycache__'
}

EXCLUDE_FILES = {
    'bun.lock',
    'paradise-academy-production.zip',
    'paradise-academy-production.tar.gz',
    'test.zip'
}

def should_include(rel_path):
    parts = rel_path.split(os.sep)
    for part in parts:
        if part in EXCLUDE_DIRS:
            return False
    if os.path.basename(rel_path) in EXCLUDE_FILES:
        return False
    return True

def create_packages():
    root_dir = os.path.abspath('.')
    zip_path = os.path.join(root_dir, 'paradise-academy-production.zip')
    tar_path = os.path.join(root_dir, 'paradise-academy-production.tar.gz')

    print("📦 Packing into paradise-academy-production.zip ...")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for foldername, subfolders, filenames in os.walk(root_dir):
            rel_folder = os.path.relpath(foldername, root_dir)
            if not should_include(rel_folder) and rel_folder != '.':
                subfolders[:] = []  # don't recurse into excluded
                continue

            for filename in filenames:
                full_path = os.path.join(foldername, filename)
                rel_file = os.path.relpath(full_path, root_dir)
                if should_include(rel_file):
                    zipf.write(full_path, rel_file)

    print("📦 Packing into paradise-academy-production.tar.gz ...")
    with tarfile.open(tar_path, 'w:gz') as tarf:
        for foldername, subfolders, filenames in os.walk(root_dir):
            rel_folder = os.path.relpath(foldername, root_dir)
            if not should_include(rel_folder) and rel_folder != '.':
                subfolders[:] = []
                continue

            for filename in filenames:
                full_path = os.path.join(foldername, filename)
                rel_file = os.path.relpath(full_path, root_dir)
                if should_include(rel_file):
                    tarf.add(full_path, arcname=rel_file)

    print("✅ Packages created successfully!")
    print(f"   - ZIP: {os.path.getsize(zip_path) / (1024*1024):.2f} MB")
    print(f"   - TAR.GZ: {os.path.getsize(tar_path) / (1024*1024):.2f} MB")

if __name__ == '__main__':
    create_packages()
