from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Initialize LLM (assuming env var OPENAI_API_KEY is set)
try:
    llm = ChatOpenAI(model="gpt-4o")
except Exception:
    llm = None # Handle case where key is missing


def generate_fix(file_content: str, error_log: str, language: str) -> str:
    prompt = ChatPromptTemplate.from_template(
        """You are a senior developer. Fix the code based on the error log.
        Language: {language}
        File Content:
        {file_content}
        
        Error Log:
        {error_log}
        
        Return ONLY the fixed code content. No markdown, no explanations.
        """
    )
    if llm is None:
        return file_content # Fallback if no LLM

    chain = prompt | llm | StrOutputParser()
    try:
        return chain.invoke({
            "language": language,
            "file_content": file_content,
            "error_log": error_log
        })
    except Exception as e:
        print(f"Error generating fix: {e}")
        return file_content # fallback

def apply_fix(file_path: str, fixed_content: str):
    with open(file_path, "w") as f:
        f.write(fixed_content)
