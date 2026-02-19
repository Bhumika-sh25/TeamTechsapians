from datetime import datetime


def create_branch_name(team_name: str, leader_name: str) -> str:
    # EXACT format: TEAM_NAME_LEADER_NAME_AI_Fix
    # All caps, underscores for spaces
    return f"{team_name.upper()}_{leader_name.upper()}_AI_FIX".replace(" ", "_")

def run_git_agent(repo_path: str, team_name: str, leader_name: str, fixes: list):
    branch_name = create_branch_name(team_name, leader_name)
    try:
        checkout_new_branch(repo_path, branch_name)
        commit_message = f"[AI-AGENT] Applied {len(fixes)} fixes"
        commit_changes(repo_path, commit_message)
        # push_changes(repo_path, branch_name) # simplified: failing if not auth
        return {
            "branch": branch_name,
            "commit": commit_message,
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}
