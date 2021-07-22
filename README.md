# Simple Github Backup

A simple Github backup image, which will fetch a mirror backup of all repos from Github

## Usage
```
docker run -it --rm \
  -e GITHUB_TOKEN="$GH_TOKEN" \
  -v "$PWD/backup:/backup" \
  --cap-drop=all \
  --user "$UID:$GID" \
  assemble-sh/github-backup
```
_note: `--user` is not required, but recommended instead of running as root. Remember to give the user write access to the backup directory_

## Backup structure
```
|-{user1}
|  |-{repo1}
|  |  |-info.json
|  |  |-git
|  |  |  |-...
|  |-{repo2}
|  |  |-info.json
|  |  |-git
|  |  |  |-...
|-{user2}
|  |-{repo1}
|  |  |-info.json
|  |  |-git
|  |  |  |-...
```

