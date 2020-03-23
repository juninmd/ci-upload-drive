# CI Upload Drive

## Install

```bash
npm i -g ci-upload-drive
```

## Usage

Create a file with permissions like

```json
[{
  "type": "domain",
  "role": "reader",
  "domain": "domain.com.br"
},
{
  "type": "user",
  "role": "writer",
  "emailAddress": "blablabla@domain.com"
}]
```

```bash
ci-upload-drive <file> <permissions.json>
```

## Envs Required

```envs
CLIENT_EMAIL
PRIVATE_KEY
FOLDER_ID
```
