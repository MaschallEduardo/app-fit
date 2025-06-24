# app-fit

## Requisitos

Para desenvolver e testar **app-fit** localmente, tenha instalado:

- **Node.js** (v14 ou superior)  
- **Yarn** ou **npm**  
- **Expo CLI** (instalado globalmente):
  ```bash
  npm install -g expo-cli
  # ou
  yarn global add expo-cli

Android Studio com um AVD configurado (para emulador Android)

Xcode (macOS) para usar o Simulator iOS

Dispositivo físico (opcional) com o app Expo Go instalado

##  Instalação

```Bash
git clone https://github.com/MaschallEduardo/app-fit.git
cd app-fit
```
```Bash
  npm install
  # ou
  yarn install
```

Crie o arquivo de variáveis de ambiente:
```Bash
cp .env.sample .env
```

Preencha o .env com suas credenciais do Firebase:
```Bash
FIREBASE_API_KEY=seu_api_key_aqui
FIREBASE_AUTH_DOMAIN=seu_auth_domain_aqui
FIREBASE_PROJECT_ID=seu_project_id_aqui
FIREBASE_STORAGE_BUCKET=seu_storage_bucket_aqui
FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id_aqui
FIREBASE_APP_ID=seu_app_id_aqui
```

Como rodar
```Bash
npx expo start
```
