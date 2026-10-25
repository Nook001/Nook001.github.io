# 发布与 PR 工作流

## 当前状态

本地初始化，无远程仓库、无推送、无部署。后续每一项远程操作需有用户明确授权。

## 日常维护

1. 检查工作区，创建 `content/...` 或 `site/...` 分支。
2. 修改 Markdown/数据；运行 README 中三个检查，审阅预览。
3. 用户授权后推送分支、创建 PR。PR 描述说明改动、事实来源、验证结果及待确认项。
4. 检查通过并经审阅后合并（代理合并同样需要授权）。合并不等于授权发布。
5. 用户明确要求发布当前版本后，执行下面的手动流程。

## 首次远程设置（尚未执行）

- 在用户授权后建立 `Nook001/Nook001.github.io`，将本地仓库连接到该远程。不要再生成 README、许可证或其他初始化提交，避免无关历史。
- 将本地 main 推送到远程。选择公开仓库前检查所有源文件，不仅是生成网页。
- 仓库 Settings → Pages → Source 必须选择 **GitHub Actions**，不要选 Deploy from a branch。
- 建议给 main 设置 PR 保护和 `Validate site / validate` 必须通过的规则；给 `github-pages` environment 限定 main，并在账号套餐允许时设置 required reviewers。不要假定这些保护已经存在。
- 仓库中的部署文件只支持手动触发；不接受从 PR、push 或 workflow_run 自动部署的改动。

## 手动发布

先完成个人资料、教育措辞、经历日期及全部示例内容审阅。运行：

```powershell
ruby scripts/check_content.rb --release
```

该检查当前应失败。它是待补资料的发布阻断，不是普通构建失败。不能为通过检查编造内容或直接删除标记。通过后仍须人工审阅，因为程序无法判断履历是否真实。

用户明确授权后，在 GitHub Actions 打开 **Publish site (manual approval)**，选择 main，输入 PUBLISH。工作流重新检查内容、生产构建与本地链接，再上传并部署同一产物。main 之外或输入错误不会发布。若设置了 environment 审批，完成该审批后才会部署。

成功后验证主页、手机布局、项目、文章、RSS、404 与下载链接。发布失败先查构建/审批证据，不为绕过审批修改代码。回滚也需明确授权，可将已审阅的回滚 PR 合入 main 后重新手动发布。

## 原生兼容性

使用 GitHub Pages 支持的 Jekyll 3.10 及 feed/seo/sitemap 插件；Actions 只是让构建验证和人工发布分开。没有 React、Next.js、Tailwind 或自定义 Jekyll 插件。不要添加 `.nojekyll`。GitHub Pages 版本表和官方文档链接见 README。
