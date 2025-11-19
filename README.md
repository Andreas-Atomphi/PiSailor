# 🏴‍☠️ PiSailor  
**Explore a imensidão do número π (PI) navegando por uma visualização interativa desenvolvida com PixiJS + Svelte.**

---

## 🚀 Visão Geral  
PiSailor é uma experiência web interativa construída em TypeScript, Svelte e PixiJS, na qual o usuário “navega” através dos dígitos de π (PI), visualizando padrões, animações e interações enquanto avança pelos seus decimais.  
O projeto nasceu da minha vontade de unir arte, matemática e programação, e serve como uma vitrine das minhas habilidades como desenvolvedor de jogos e aplicações interativas.

---

## 🧩 Funcionalidades  
- ✔ Visualização de dígitos de π em forma de representação visual/animada (por exemplo: pontos, espirais, cores)  
- ✔ Interface interativa construída com Svelte — controle de velocidade, zoom, estilo de visualização  
- ✔ Renderização gráfica com PixiJS para performance leve no navegador  
- ✔ Responsividade / leveza mesmo em hardware limitado

---

## 🛠️ Tecnologias Utilizadas  
- TypeScript  
- Svelte  
- PixiJS  
- Vite (configuração de build)  

---

## 📁 Estrutura do Projeto  
PiSailor/
├── public/                # Arquivos estáticos públicos (ícones, HTML base, favicon etc.)
│   ├── index.html
│   └── assets/            # imagens, sons, fontes…
├── src/                   # Código-fonte da aplicação
│   ├── components/        # Componentes Svelte
│   ├── visuals/           # Código que lida com renderização gráfica (PixiJS)
│   ├── stores/            # Estado da aplicação (Svelte stores ou similares)
│   ├── utils/             # Funções utilitárias, tratamento de dados (ex: lidar com dígitos de π)
│   └── main.ts            # Ponto de entrada da aplicação
├── package.json
├── vite.config.ts         # Configuração do bundler/build
├── tsconfig.json          # Configuração de TypeScript
├── README.md
└── LICENSE
