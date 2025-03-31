import subprocess
from openai import OpenAI
import os

gitmoji = {
    "🎨": "Improve structure / format of the code.",
    "⚡️": "Improve performance.",
    "🔥": "Remove code or files.",
    "🐛": "Fix a bug.",
    "🚑️": "Critical hotfix.",
    "✨": "Introduce new features.",
    "📝": "Add or update documentation.",
    "🚀": "Deploy stuff.",
    "💄": "Add or update the UI and style files.",
    "🎉": "Begin a project.",
    "✅": "Add, update, or pass tests.",
    "🔒️": "Fix security or privacy issues.",
    "🔐": "Add or update secrets.",
    "🔖": "Release / Version tags.",
    "🚨": "Fix compiler / linter warnings.",
    "🚧": "Work in progress.",
    "💚": "Fix CI Build.",
    "⬇️": "Downgrade dependencies.",
    "⬆️": "Upgrade dependencies.",
    "📌": "Pin dependencies to specific versions.",
    "👷": "Add or update CI build system.",
    "📈": "Add or update analytics or track code.",
    "♻️": "Refactor code.",
    "➕": "Add a dependency.",
    "➖": "Remove a dependency.",
    "🔧": "Add or update configuration files.",
    "🔨": "Add or update development scripts.",
    "🌐": "Internationalization and localization.",
    "✏️": "Fix typos.",
    "💩": "Write bad code that needs to be improved.",
    "⏪️": "Revert changes.",
    "🔀": "Merge branches.",
    "📦️": "Add or update compiled files or packages.",
    "👽️": "Update code due to external API changes.",
    "🚚": "Move or rename resources (e.g.: files, paths, routes).",
    "📄": "Add or update license.",
    "💥": "Introduce breaking changes.",
    "🍱": "Add or update assets.",
    "♿️": "Improve accessibility.",
    "💡": "Add or update comments in source code.",
    "🍻": "Write code drunkenly.",
    "💬": "Add or update text and literals.",
    "🗃️": "Perform database related changes.",
    "🔊": "Add or update logs.",
    "🔇": "Remove logs.",
    "👥": "Add or update contributor(s).",
    "🚸": "Improve user experience / usability.",
    "🏗️": "Make architectural changes.",
    "📱": "Work on responsive design.",
    "🤡": "Mock things.",
    "🥚": "Add or update an easter egg.",
    "🙈": "Add or update a .gitignore file.",
    "📸": "Add or update snapshots.",
    "⚗️": "Perform experiments.",
    "🔍️": "Improve SEO.",
    "🏷️": "Add or update types.",
    "🌱": "Add or update seed files.",
    "🚩": "Add, update, or remove feature flags.",
    "🥅": "Catch errors.",
    "💫": "Add or update animations and transitions.",
    "🗑️": "Deprecate code that needs to be cleaned up.",
    "🛂": "Work on code related to authorization, roles and permissions.",
    "🩹": "Simple fix for a non-critical issue.",
    "🧐": "Data exploration/inspection.",
    "⚰️": "Remove dead code.",
    "🧪": "Add a failing test.",
    "👔": "Add or update business logic.",
    "🩺": "Add or update healthcheck.",
    "🧱": "Infrastructure related changes.",
    "🧑‍💻": "Improve developer experience.",
    "💸": "Add sponsorships or money related infrastructure.",
    "🧵": "Add or update code related to multithreading or concurrency.",
    "🦺": "Add or update code related to validation.",
    "✈️": "Improve offline support.",
}

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

def get_diff(base="HEAD", staged=True):
    args = ["git", "diff", "--cached"] if staged else ["git", "diff", base]
    result = subprocess.run(args, capture_output=True, text=True)
    return result.stdout
#
def generate_commit_message(diff):
    gitmoji_examples = "\n".join(
        [f"- {key}: {value}" for key, value in gitmoji.items()]
    )

    prompt = f"""
    Given the following Git diff, generate a concise and meaningful commit message using the Gitmoji format.
    Format it as: `:emoji: commit message`, all in lower case.

    Use present emoji, and pick the most appropriate Gitmoji
    Examples:
    🎨 Improve structure / format of the code
    ⚡️ Improve performance
    🔥 Remove code or files
    🐛 Fix a bug
    🚑️ Critical hotfix
    ✨ Introduce new features
    
    Git diff:
    {diff}
    """

    response = client.responses.create(
        model="gpt-4o",
        instructions="You are a helpful assistant that writes Git commit messages.",
        input=prompt,
    )

    return response.output_text.strip()

def main():
    staged_diff = get_diff(staged=True)
    if not staged_diff.strip():
        print("No staged changes found. Use `git add` to stage your changes.")
        return

    commit_message = generate_commit_message(staged_diff)
    print(f"\nSuggested commit message:\n{commit_message}")

if __name__ == "__main__":
    main()
