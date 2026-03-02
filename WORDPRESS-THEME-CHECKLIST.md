# WordPress オリジナルテーマ化 チェックリスト

この静的サイトを WordPress テーマとして改変する際の確認事項と対応方針です。

---

## 1. 現状で問題ない点（そのまま活かせる）

| 項目 | 理由 |
|------|------|
| **BEM クラス名** | `entry__thumb`, `article-single__body` など、WP の `post_class()` / `body_class()` と併用可能。競合しない。 |
| **JS の ID 参照** | `#sidebar-overlay`, `#search-overlay`, `#search-overlay-input`, `#contact-form` などは 1 ページに 1 つずつ。テーマで共通パーツとして 1 回だけ出力すれば重複しない。 |
| **sidebar-overlay.js** | `getElementById` / `querySelectorAll` のみで、jQuery 非依存。WP で `wp_enqueue_script` して読み込めばそのまま利用可能。 |
| **SCSS/CSS** | スタイルはそのまま流用可能。テーマでは `style.css` をエンキューするか、ビルドパスを `get_stylesheet_directory_uri()` で指定。 |
| **画像の比率制御** | `$aspect-thumb`, `entry__thumb--portrait` などは、WP では投稿のカスタムフィールドやアイキャッチの縦横からクラスを出し分けすれば対応可能。 |

---

## 2. テーマ化時に必ず置き換えるもの

### 2.1 リンク URL（静的 → 動的）

| 現在の記述 | WordPress での置き換え |
|------------|-------------------------|
| `href="index.html"` | `<?php echo esc_url( home_url( '/' ) ); ?>` |
| `href="article.html"`（一覧のカード） | `<?php the_permalink(); ?>` |
| 「一覧へ戻る」の `index.html` | `<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ); ?>` または `home_url( '/' )` |
| `href="contact.html"` | お問い合わせ固定ページの `<?php echo esc_url( get_permalink( ○○ ) ); ?>`（ページ ID またはスラッグ指定） |
| `href="privacy.html"` | `<?php echo esc_url( get_privacy_policy_url() ); ?>`（設定でプライバシーポリシーページを指定している場合） |

※ メニュー・サイドバー内の「ホーム」「お問い合わせ」「プライバシーポリシー」も上記に統一する。

### 2.2 ヘッダー・フッターの文言

| 現在 | 置き換え例 |
|------|------------|
| サイト名「かつの一日ひとつ」 | `<?php bloginfo( 'name' ); ?>` |
| キャッチフレーズ「散歩したり、本を読んだり…」 | `<?php bloginfo( 'description' ); ?>` |
| フッター © 2023 | `<?php echo date( 'Y' ); ?>` と `bloginfo( 'name' )` |

### 2.3 検索フォーム

- **action**: `action="#"` → `action="<?php echo esc_url( home_url( '/' ) ); ?>"`
- **入力 name**: `name="q"` → `name="s"`（WP の検索は `s` が標準）
- 検索結果表示用に `search.php` テンプレートを新規作成する。

---

## 3. テンプレート構成の目安

| 現在のファイル | WordPress テンプレート | 備考 |
|----------------|------------------------|------|
| index.html（一覧） | `index.php` または `home.php` | メインループで投稿一覧。サイドバーは `get_sidebar()`。 |
| article.html（1 記事） | `single.php` | 1 投稿表示。`the_post_thumbnail()`, `the_title()`, `the_content()`, `the_category()` などで動的化。 |
| contact.html | `page-contact.php` または 固定ページテンプレート | 固定ページ「お問い合わせ」に割り当て。フォームは CF7 等に差し替えも可。 |
| privacy.html | 固定ページ「プライバシーポリシー」＋ `get_privacy_policy_url()` | 設定でプライバシーポリシーページを指定すれば URL は自動。 |
| 共通部分 | `header.php`, `footer.php`, `sidebar.php` | ヘッダー・フッター・サイドバー。検索オーバーレイとサイドバーオーバーレイは **1 回だけ** 出力（例: `footer.php` の `</div><!-- .page -->` の後など）。 |

### テンプレートパーツに分けるとよいブロック

- サイトヘッダー（`template-parts/header.php` など）
- フッター（`template-parts/footer.php`）
- 下固定ナビ（SP）（`template-parts/bottom-nav.php`）
- 検索オーバーレイ（`template-parts/search-overlay.php`）
- サイドバーオーバーレイ（`template-parts/sidebar-overlay.php`）
- エントリーカード 1 件（`template-parts/entry-card.php`）→ ループ内で `get_template_part( 'template-parts/entry-card' );`

---

## 4. 動的コンテンツの取得

### 4.1 一覧（index / home）

- ループ: `while ( have_posts() ) : the_post();` で各投稿を表示。
- カード内:
  - リンク: `the_permalink()`
  - タイトル: `the_title()`
  - 抜粋: `the_excerpt()`
  - 日付: `the_date( 'Y.m.d' )` または `get_the_date()`
  - アイキャッチ: `the_post_thumbnail( 'medium' )` など。サイズは `functions.php` で追加登録可。
  - カテゴリ: `the_category( ' ' )` や `get_the_category()`
- 縦長サムネ: アイキャッチの幅・高さから比率を算出し、`entry__thumb--portrait` を付与するか、カスタムフィールドで制御。

### 4.2 単一記事（single）

- タイトル: `the_title()`
- 日付: `the_date()` / `get_the_date()`
- カテゴリ: `the_category()`
- アイキャッチ: `the_post_thumbnail( 'large' )` など
- 本文: `the_content()`
- 「一覧へ戻る」: 投稿一覧の URL（`home_url( '/' )` または「投稿ページ」の URL）

### 4.3 サイドバー

- **自己紹介**: 固定テキスト or 「プロフィール」ウィジェット / カスタム HTML ウィジェット。
- **人気記事**: `WP_Query` で `orderby => 'comment_count'` や「人気順」プラグイン、またはウィジェット。
- **カテゴリ**: `wp_list_categories()` で出力。スタイルは既存の `widget--categories` のクラスを付与。

サイドバーは `sidebar.php` で HTML をそのまま書きつつ、中身を PHP で動的化するか、WP ウィジェットエリア（`register_sidebar`）を設けてウィジェットで出力するか選べる。

---

## 5. アセット（CSS / JS）の読み込み

- **style.css**:  
  `wp_enqueue_style( 'theme-style', get_stylesheet_uri(), array(), '1.0' );`  
  サブディレクトリに置く場合は `get_stylesheet_directory_uri() . '/assets/style.css'` など。
- **Google Fonts**:  
  同じく `wp_enqueue_style` で読み込むか、`functions.php` で preconnect を `wp_head` に追加。
- **sidebar-overlay.js**:  
  `wp_enqueue_script( 'sidebar-overlay', get_template_directory_uri() . '/js/sidebar-overlay.js', array(), '1.0', true );`  
  `true` でフッター読み込み推奨（DOM が揃った後）。
- お問い合わせの mailto 用インラインスクリプト:  
  固定ページテンプレートにそのまま書くか、別 JS に切り出して「お問い合わせページだけ」エンキュー。メールアドレスは `get_option( 'admin_email' )` やカスタムオプションで渡すとよい。

---

## 6. その他の注意点

1. **必須テーマファイル**  
   `style.css`（テーマヘッダー付き）, `index.php` は必須。  
   `functions.php`, `header.php`, `footer.php`, `sidebar.php`, `single.php`, `page.php` があると運用しやすい。

2. **重複 ID**  
   検索オーバーレイ・サイドバーオーバーレイは、共通パーツとして 1 回だけ出力するため、ID の重複は起きない。

3. **お問い合わせメール**  
   現在の `infinityzerorei0@gmail.com` は、テーマではオプション（カスタマイザーや設定ページ）で変更できるようにするとよい。

4. **ページネーション**  
   一覧の「次のページ」「ページ番号」は `the_posts_pagination()` に置き換え、必要に応じて既存の `.pagination` 用 CSS を当てる。

5. **固定ページ「お問い合わせ」**  
   contact 用テンプレートを使う場合、固定ページのスラッグを `contact` にすると `page-contact.php` が自動で使われる。

---

## 7. まとめ

- **HTML 構造・BEM・JS・CSS** はそのまま活かして問題ない。
- **リンク・タイトル・日付・抜粋・アイキャッチ・カテゴリ** を WP の関数に置き換える。
- **検索は `name="s"` と `home_url( '/' )`、検索結果は `search.php`** で対応。
- **共通パーツ（ヘッダー・フッター・オーバーレイ）** を 1 回だけ出力するようにテンプレートを分割すれば、ID やレイアウトの不具合は防げる。

この方針でテーマ化すれば、現状のデザイン・挙動を維持したままコンテンツを動的に取得できます。
