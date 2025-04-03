#!/usr/bin/env python3
import subprocess
import sys

# Mapping each commit emoji to a release category.
RELEASE_CATEGORIES = {
    "🎨": "Improvements",             # Improve structure / format of the code.
    "⚡️": "Improvements",             # Improve performance.
    "🔥": "Maintenance",               # Remove code or files.
    "🐛": "Bug Fixes",                 # Fix a bug.
    "🚑️": "Bug Fixes",                # Critical hotfix.
    "✨": "Features",                  # Introduce new features.
    "📝": "Documentation",             # Add or update documentation.
    "🚀": "Features",                  # Deploy stuff.
    "💄": "Improvements",                  # Add or update the UI and style files.
    "🎉": "Features",                  # Begin a project.
    "✅": "Tests",                     # Add, update, or pass tests.
    "🔒️": "Bug Fixes",                # Fix security or privacy issues.
    "🔐": "Maintenance",               # Add or update secrets.
    "🔖": "Maintenance",               # Release / Version tags.
    "🚨": "Bug Fixes",                # Fix compiler / linter warnings.
    "🚧": "Maintenance",               # Work in progress.
    "💚": "Bug Fixes",                 # Fix CI Build.
    "⬇️": "Maintenance",              # Downgrade dependencies.
    "⬆️": "Maintenance",              # Upgrade dependencies.
    "📌": "Maintenance",              # Pin dependencies to specific versions.
    "👷": "Maintenance",              # Add or update CI build system.
    "📈": "Features",                 # Add or update analytics or tracking.
    "♻️": "Improvements",             # Refactor code.
    "➕": "Maintenance",              # Add a dependency.
    "➖": "Maintenance",              # Remove a dependency.
    "🔧": "Maintenance",              # Add or update configuration files.
    "🔨": "Maintenance",              # Add or update development scripts.
    "🌐": "Improvements",                 # Internationalization and localization.
    "✏️": "Bug Fixes",                # Fix typos.
    "💩": "Maintenance",              # Write bad code that needs to be improved.
    "⏪️": "Maintenance",              # Revert changes.
    "🔀": "Maintenance",              # Merge branches.
    "📦️": "Maintenance",             # Add or update compiled files or packages.
    "👽️": "Bug Fixes",                # Update code due to external API changes.
    "🚚": "Maintenance",              # Move or rename resources.
    "📄": "Documentation",            # Add or update license.
    "💥": "Breaking Changes",         # Introduce breaking changes.
    "🍱": "Features",                 # Add or update assets.
    "♿️": "Improvements",             # Improve accessibility.
    "💡": "Maintenance",              # Add or update comments in source code.
    "🍻": "Maintenance",              # Write code drunkenly.
    "💬": "Features",                 # Add or update text and literals.
    "🗃️": "Maintenance",             # Perform database related changes.
    "🔊": "Maintenance",              # Add or update logs.
    "🔇": "Maintenance",              # Remove logs.
    "👥": "Maintenance",              # Add or update contributor(s).
    "🚸": "Improvements",             # Improve user experience / usability.
    "🏗️": "Improvements",             # Make architectural changes.
    "📱": "Improvements",             # Work on responsive design.
    "🤡": "Maintenance",              # Mock things.
    "🥚": "Features",                 # Add or update an easter egg.
    "🙈": "Maintenance",              # Add or update a .gitignore file.
    "📸": "Tests",                    # Add or update snapshots.
    "⚗️": "Maintenance",              # Perform experiments.
    "🔍️": "Improvements",             # Improve SEO.
    "🏷️": "Maintenance",             # Add or update types.
    "🌱": "Maintenance",              # Add or update seed files.
    "🚩": "Features",                 # Add, update, or remove feature flags.
    "🥅": "Bug Fixes",                # Catch errors.
    "💫": "Improvements",             # Add or update animations and transitions.
    "🗑️": "Maintenance",             # Deprecate code that needs to be cleaned up.
    "🛂": "Features",                 # Work on code related to authorization.
    "🩹": "Bug Fixes",                # Simple fix for a non-critical issue.
    "🧐": "Maintenance",              # Data exploration/inspection.
    "⚰️": "Maintenance",              # Remove dead code.
    "🧪": "Tests",                    # Add a failing test.
    "👔": "Features",                 # Add or update business logic.
    "🩺": "Maintenance",              # Add or update healthcheck.
    "🧱": "Maintenance",              # Infrastructure related changes.
    "🧑‍💻": "Improvements",           # Improve developer experience.
    "💸": "Features",                 # Add sponsorships or money related infrastructure.
    "🧵": "Improvements",             # Add or update code related to multithreading.
    "🦺": "Improvements",             # Add or update code related to validation.
    "✈️": "Improvements"              # Improve offline support.
}

def get_previous_tag():
    """
    Retrieves the previous tag from the repository.
    """
    try:
        result = subprocess.run(
            ["git", "tag", "--sort=-v:refname"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        tags = result.stdout.strip().split('\n')
        if len(tags) < 2:
            sys.exit("Not enough tags in the repository to find a previous one.")
        return tags[1]  # Second tag is the previous one
    except subprocess.CalledProcessError as e:
        sys.exit(f"Error retrieving tags:\n{e.stderr}")

def get_repo_url():
    """
    Retrieves the remote repository URL from git configuration and converts it to an HTTPS URL.
    """
    try:
        result = subprocess.run(
            ["git", "config", "--get", "remote.origin.url"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        repo_url = result.stdout.strip()
        if repo_url.startswith("git@github.com:"):
            repo_url = repo_url.replace("git@github.com:", "https://github.com/")
        if repo_url.endswith(".git"):
            repo_url = repo_url[:-4]
        return repo_url
    except subprocess.CalledProcessError:
        print("Warning: Could not retrieve remote repository URL.")
        return None

def get_git_commits(start_version):
    """
    Retrieves git commit logs in the format: <full_hash>|||<commit message>
    Only commits between start_version and HEAD are retrieved.
    """
    try:
        result = subprocess.run(
            ["git", "log", f"{start_version}..HEAD", "--pretty=format:%H|||%s"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        commits = []
        for line in result.stdout.strip().split("\n"):
            if line:
                parts = line.split("|||", 1)
                if len(parts) == 2:
                    commit_hash, subject = parts
                    commits.append({"hash": commit_hash, "subject": subject})
        return commits
    except subprocess.CalledProcessError as e:
        sys.exit(f"Error retrieving git commits:\n{e.stderr}")

def categorize_commits(commits, mapping):
    """
    Categorize each commit into a release category based on the first matching emoji.
    Commits with no matching emoji fall into 'Others'.
    Adds the found emoji and category to the commit dictionary.
    """
    categorized = {
        "Features": [],
        "Bug Fixes": [],
        "Improvements": [],
        "Documentation": [],
        "Tests": [],
        "Maintenance": [],
        "Breaking Changes": [],
        "Others": []
    }
    
    for commit in commits:
        subject = commit["subject"]
        emoji_found = None
        found_category = None
        for emoji, category in mapping.items():
            if emoji in subject:
                emoji_found = emoji
                found_category = category
                break  # Use the first matching emoji
        if emoji_found:
            commit["emoji"] = emoji_found
            commit["category"] = found_category
        else:
            commit["emoji"] = ""
            commit["category"] = "Others"
        categorized[commit["category"]].append(commit)
    return categorized

def write_changelog(categorized, repo_url, output_file="./CHANGELOG.md"):
    """
    Writes a Markdown changelog grouping commits by release category.
    Each commit is formatted as: 
    - emoji commit message ([short_hash](repo_url/commit/full_hash))
    """
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("# Changelog\n\n")
        order = [
            "Features",
            "Bug Fixes",
            "Improvements",
            "Documentation",
            "Tests",
            "Maintenance",
            "Breaking Changes",
            "Others"
        ]
        for category in order:
            commits = categorized.get(category, [])
            if commits:
                f.write(f"## {category}\n")
                for commit in commits:
                    full_hash = commit["hash"]
                    short_hash = full_hash[:7]
                    subject = commit["subject"]
                    emoji = commit["emoji"]
                    line = f"- {subject} ([{short_hash}]({repo_url}/commit/{full_hash}))\n"
                    f.write(line)
                f.write("\n")
    print(f"Changelog written to {output_file}")

def main():
    latest_tag = get_previous_tag()
    print(f"Using latest tag: {latest_tag}")
    repo_url = get_repo_url()
    if not repo_url:
        print("Error: Could not determine repository URL.")
        sys.exit(1)
    commits = get_git_commits(latest_tag)
    categorized = categorize_commits(commits, RELEASE_CATEGORIES)
    write_changelog(categorized, repo_url)

if __name__ == "__main__":
    main()
