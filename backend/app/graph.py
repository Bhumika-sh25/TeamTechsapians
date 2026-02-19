from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Optional
from app.agents.analyzer import run_analyzer_agent
from app.agents.debugger import run_tests_in_docker
from app.agents.fixer import generate_fix, apply_fix
from app.tools.git_ops import run_git_agent

class AgentState(TypedDict):
    repo_url: str
    team_name: str
    leader_name: str
    repo_path: str
    language: str
    test_files: List[str]
    max_retries: int
    current_retry: int
    fixes: List[dict]
    logs: List[str]
    status: str

def analyzer_node(state: AgentState):
    print("--- ANALYZER NODE ---")
    output = run_analyzer_agent(state["repo_url"])
    return {
        "repo_path": output.repo_path,
        "language": output.language,
        "test_files": output.test_files,
        "logs": state["logs"] + [f"Analyzed repo: {output.language}, found {len(output.test_files)} test files"]
    }

def debugger_node(state: AgentState):
    print("--- DEBUGGER NODE ---")
    results = run_tests_in_docker(state["repo_path"], state["language"])
    
    status = "tests_passed" if results.get("exit_code") == 0 else "tests_failed"
    log_msg = f"Tests finished with exit code {results.get('exit_code')}"
    
    return {
        "status": status,
        "logs": state["logs"] + [log_msg, results.get("logs", "")],
        "current_retry": state["current_retry"] + 1
    }

def fixer_node(state: AgentState):
    print("--- FIXER NODE ---")
    # Simplified: finding error in last log
    last_log = state["logs"][-1]
    
    # In a real scenario, we'd parse the log to find the specific file and error
    # For now, we'll just pick a test file to "fix" if available
    target_file = state["test_files"][0] if state["test_files"] else "unknown"
    
    # Attempt to extract line number and error type from log (simplified regex or keyword search)
    import re
    line_match = re.search(r"line (\d+)", last_log)
    line_num = int(line_match.group(1)) if line_match else 1
    
    error_type = "UNKNOWN"
    if "SyntaxError" in last_log: error_type = "SYNTAX"
    elif "IndentationError" in last_log: error_type = "INDENTATION"
    elif "ImportError" in last_log or "ModuleNotFoundError" in last_log: error_type = "IMPORT"
    elif "AssertionError" in last_log: error_type = "LOGIC"
    elif "TypeError" in last_log: error_type = "TYPE_ERROR"
    
    # Generate fix
    fix_content = generate_fix(target_file, last_log, state["language"])
    apply_fix(target_file, fix_content)
    
    new_fix = {
        "file": target_file, 
        "type": error_type,
        "line": line_num,
        "message": f"Fixed {error_type} error at line {line_num}",
        "status": "applied"
    }
    
    return {
        "fixes": state["fixes"] + [new_fix],
        "logs": state["logs"] + [f"Applied fix to {target_file}: {error_type} at line {line_num}"]
    }

def git_manager_node(state: AgentState):
    print("--- GIT MANAGER NODE ---")
    result = run_git_agent(state["repo_path"], state["team_name"], state["leader_name"], state["fixes"])
    return {
        "logs": state["logs"] + [f"Git operation: {result['status']} - {result.get('branch')}"]
    }

def should_continue(state: AgentState):
    if state["status"] == "tests_passed":
        return "git_manager"
    
    if state["current_retry"] >= state["max_retries"]:
        return "git_manager" # Commit whatever we have or just fail
        
    return "fixer"

workflow = StateGraph(AgentState)

workflow.add_node("analyzer", analyzer_node)
workflow.add_node("debugger", debugger_node)
workflow.add_node("fixer", fixer_node)
workflow.add_node("git_manager", git_manager_node)

workflow.set_entry_point("analyzer")
workflow.add_edge("analyzer", "debugger")
workflow.add_conditional_edges(
    "debugger",
    should_continue,
    {
        "fixer": "fixer",
        "git_manager": "git_manager"
    }
)
workflow.add_edge("fixer", "debugger")
workflow.add_edge("git_manager", END)

app_graph = workflow.compile()
