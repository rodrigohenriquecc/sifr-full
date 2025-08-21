# Publicar em GitHub Pages
Este pacote está pronto para o repositório **sifr-full** do usuário **rodrigohenriquecc**, com URL final:
https://rodrigohenriquecc.github.io/sifr-full/

## Passos
1) Crie o repositório **sifr-full** em sua conta.
2) Faça upload de TODOS os arquivos desta pasta na branch **main**.
3) Em **Settings → Secrets and variables → Actions → New repository secret** crie:
   - `VITE_GOOGLE_MAPS_API_KEY` = sua chave (com restrição por referrer para https://rodrigohenriquecc.github.io/*)
4) Em **Settings → Pages** selecione **GitHub Actions**.
5) Faça um novo commit/push ou rode manualmente o workflow **Deploy Web to GitHub Pages**.
6) Acesse: https://rodrigohenriquecc.github.io/sifr-full/

Observações:
- O `vite.config.js` já está com `base: "/sifr-full/"`.
- O workflow usa `apps/web` como projeto frontend e publica o conteúdo de `dist/`.
- Para usar a API em produção, ajuste `VITE_API_URL` no workflow para a URL pública do seu backend (CORS permitido).
