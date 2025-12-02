#!/usr/bin/env python3
"""
Property-based tests for CKA Module 1 directory structure and lab completeness.

Feature: cka-module1-cluster-architecture, Property 27: Lab exercises for all major topics
Validates: Requirements 8.1
"""

import os
import pytest
from pathlib import Path

# Base directory for the project
BASE_DIR = Path(__file__).parent.parent

# Major topics that should have lab directories
MAJOR_TOPICS = [
    "cluster-components",
    "kind-setup",
    "kubeadm-cluster",
    "ha-configuration",
    "pod-security",
    "rbac-configuration",
    "crds",
    "helm-kustomize"
]


def test_required_directories_exist():
    """
    Property 27: Lab exercises for all major topics
    For any major topic, a corresponding lab directory should exist with instructions.
    """
    required_dirs = [
        "theory",
        "labs",
        "configs",
        "configs/kind",
        "configs/kubeadm",
        "configs/rbac",
        "configs/pod-security",
        "configs/crds",
        "configs/kustomize",
        "scripts",
        "diagrams"
    ]
    
    for dir_path in required_dirs:
        full_path = BASE_DIR / dir_path
        assert full_path.exists(), f"Required directory '{dir_path}' does not exist"
        assert full_path.is_dir(), f"'{dir_path}' exists but is not a directory"


def test_lab_directories_for_all_major_topics():
    """
    Property 27: Lab exercises for all major topics
    For any major topic, a corresponding lab directory should exist.
    """
    labs_dir = BASE_DIR / "labs"
    
    for i, topic in enumerate(MAJOR_TOPICS, start=1):
        lab_dir = labs_dir / f"lab{i:02d}-{topic}"
        assert lab_dir.exists(), f"Lab directory for topic '{topic}' does not exist at {lab_dir}"
        assert lab_dir.is_dir(), f"Lab path for '{topic}' exists but is not a directory"


def test_lab_readme_files_exist():
    """
    Property 27: Lab exercises for all major topics
    For any lab directory, it should contain a README.md file with instructions.
    """
    labs_dir = BASE_DIR / "labs"
    
    for i, topic in enumerate(MAJOR_TOPICS, start=1):
        lab_dir = labs_dir / f"lab{i:02d}-{topic}"
        readme_file = lab_dir / "README.md"
        
        if lab_dir.exists():
            assert readme_file.exists(), f"README.md missing in {lab_dir}"
            assert readme_file.is_file(), f"README.md in {lab_dir} is not a file"
            
            # Verify file is not empty
            assert readme_file.stat().st_size > 0, f"README.md in {lab_dir} is empty"


def test_readme_files_in_main_directories():
    """
    Verify that main directories have README files for navigation.
    """
    dirs_with_readme = ["theory", "labs", "configs", "scripts", "diagrams"]
    
    for dir_name in dirs_with_readme:
        readme_path = BASE_DIR / dir_name / "README.md"
        assert readme_path.exists(), f"README.md missing in {dir_name}/ directory"
        assert readme_path.stat().st_size > 0, f"README.md in {dir_name}/ is empty"


def test_main_readme_exists():
    """
    Verify the main README.md exists at the project root.
    """
    main_readme = BASE_DIR / "README.md"
    assert main_readme.exists(), "Main README.md does not exist"
    assert main_readme.stat().st_size > 0, "Main README.md is empty"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
