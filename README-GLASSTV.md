# Glass TV — protótipo Android TV 9

Contém a interface original exportada do Google AI Studio, uma ponte nativa Android e um workflow GitHub Actions.

## Compilar
1. Crie um repositório GitHub e envie **o conteúdo** desta pasta à raiz.
2. Abra Actions > Build Glass TV APK > Run workflow.
3. Quando o job terminar, baixe o artifact GlassTV-Android-APK e extraia `app-debug.apk`.

## Limites / testes necessários
- APK ainda **não foi compilado nem testado na televisão** neste ambiente.
- A integração usa WebView + JavaScript bridge; apps são obtidos do PackageManager e abertos via Intent.
- O APK não substitui automaticamente o launcher original. Instale, abra pelo menu de aplicativos e teste primeiro.
- Apps instalados que não disponibilizam uma Activity LAUNCHER/LEANBACK_LAUNCHER podem não aparecer.
- A interface usa recursos web e pode precisar de otimização para o WebView do Android TV 9.
- O catálogo demonstra nomes e ícones originais do Glass TV; ícones reais de apps recém-descobertos exigem integração adicional.
- Sem o pacote final compilado, não há garantia de compatibilidade.
- Este pacote não incorpora o código do Free My TV; a base Android foi implementada de modo isolado para não herdar permissões ou configurações de sistema potencialmente arriscadas.
