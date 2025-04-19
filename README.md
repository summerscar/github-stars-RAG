# GitHub Stars RAG

一个基于 [Cloudflare Auto RAG](https://developers.cloudflare.com/autorag/)（Retrieval-Augmented Generation）的 GitHub Star 项目管理系统。

## ENV

- `GITHUB_TOKEN`: GitHub 访问令牌，用于访问 GitHub API。
- `GITHUB_CLIENT_SECRET`: GitHub 客户端密钥，用于 OAuth 授权。
- `GITHUB_REDIRECT_URI`: GitHub 重定向 URI，用于 OAuth 授权。

## FontEnd

### Settings

- `R2_ACCOUNT_ID`: R2 账户 ID，用于访问 R2 存储。
- `R2_ACCESS_KEY_ID`: R2 访问密钥 ID，用于访问 R2 存储。
- `R2_SECRET_ACCESS_KEY`: R2 秘密访问密钥，用于访问 R2 存储。
- `R2_BUCKET`: R2 存储桶名称，用于指定存储位置。
  - [配置 CORS 规则](https://developers.cloudflare.com/r2/buckets/cors/)，允许跨域访问。
    - `[{"AllowedOrigins": ["https://github-stars.app.summerscar.me"],"AllowedMethods": ["GET","PUT"]}]`
- `AUTO_RAG_NAME`: Auto RAG 名称，用于项目标识。
  - 创建 Auto RAG 时，选择对应的 R2_BUCKET
- `AUTO_RAG_TOKEN`: Auto RAG 令牌，用于 API 身份验证。
- Sync Files: 同步文件到 R2_BUCKET 存储。
  - 同步完成后，Cloudflare Auto RAG 面板手动 Sync Index
  - Index 创建后，获得 Auto RAG 搜索结果
