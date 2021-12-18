# Simple GitHub Backup

A simple GitHub backup image, which will fetch a mirror backup of all repos the user is associated with from GitHub

## Usage
```
docker run -it --rm \
  -e GITHUB_TOKEN="$GH_TOKEN" \
  -v "$PWD/backup:/backup" \
  --cap-drop=all \
  --user "$UID:$GID" \
  ghcr.io/morten-olsen/github-backup run
```
_Note: `--user` is not required, but recommended instead of running as root. Remember to give the user write access to the backup directory_

You can also limit which repositories to back up using the environment variables `INCLUDE` and `EXCLUDE`, which supports a list or repos separated by `,` and with `*` as wildcard

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

