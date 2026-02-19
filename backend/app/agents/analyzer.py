import git
import os
import shutil
from pydantic import BaseModel

class AnalyzerInput(BaseModel):
    repo_url: str

class AnalyzerOutput(BaseModel):
    repo_path: str
    test_files: list[str]
    language: str

def clone_repository(repo_url: str, target_dir: str = "cloned_repo"):
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
    git.Repo.clone_from(repo_url, target_dir)
    return target_dir

def analyze_repository(repo_path: str) -> AnalyzerOutput:
    test_files = []
    language = "unknown"
    
    for root, dirs, files in os.walk(repo_path):
        for file in files:
            if file.endswith(".py"):
                language = "python"
                if "test" in file or file.startswith("test_"):
                    test_files.append(os.path.join(root, file))
            elif file.endswith(".js") or file.endswith(".ts"):
                language = "javascript" # simplified
                if "test" in file or "spec" in file:
                    test_files.append(os.path.join(root, file))
    
    return AnalyzerOutput(repo_path=repo_path, test_files=test_files, language=language)

def run_analyzer_agent(repo_url: str) -> AnalyzerOutput:
    repo_path = clone_repository(repo_url, target_dir="/tmp/repo_clone") # Using tmp for now
    return analyze_repository(repo_path)
