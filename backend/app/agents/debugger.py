import docker
import os

def run_tests_in_docker(repo_path: str, language: str, test_cmd: str = None):
    client = docker.from_env()
    
    # Define image and command based on language
    if language == "python":
        image = "python:3.9-slim"
        command = test_cmd or "pytest"
    elif language == "javascript" or language == "typescript":
        image = "node:18-slim"
        command = test_cmd or "npm test"
    else:
        return {"error": "Unsupported language"}

    try:
        container = client.containers.run(
            image,
            command=f"sh -c 'cd /app && {command}'", # simplified
            volumes={os.path.abspath(repo_path): {'bind': '/app', 'mode': 'rw'}},
            working_dir="/app",
            detach=True,
            # remove=True # keep for debugging if needed, but should remove
        )
        
        result = container.wait()
        logs = container.logs().decode('utf-8')
        container.remove()
        
        return {
            "exit_code": result['StatusCode'],
            "logs": logs
        }
    except Exception as e:
        return {"error": str(e)}
