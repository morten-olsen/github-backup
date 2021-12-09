# Simple Github Backup

A simple Github backup image, which will fetch a mirror backup of all repos the user is associated with from Github

## Usage
```
docker run -it --rm \
  -e GITHUB_TOKEN="$GH_TOKEN" \
  -v "$PWD/backup:/backup" \
  --cap-drop=all \
  --user "$UID:$GID" \
  ghcr.io/morten-olsen/github-backup
```
_note: `--user` is not required, but recommended instead of running as root. Remember to give the user write access to the backup directory_

You can also limit which repositories to backup using the environment variabled `INCLUDE` and `EXCLUDE`, which supports a list or repos separated by `,` and with `*` as wildcard

```
-e INCLUDE="morten-olsen/*,morten-olsen-env/dotfiles" -e EXCLUDE="morten-olsen/something,*/test"
```

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

