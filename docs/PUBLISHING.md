# 审核与发布

## 固定边界

远程为 `https://github.com/Nook001/Nook001.github.io.git`，仓库公开。
Pages 发布源保持 **GitHub Actions**；不改回分支发布。
过去曾发生首次推送自动开启 legacy 发布，已纠正；不能依赖首次 API 404 推断推送不会发布。

每次发布需要用户明确授权当前版本。过去某次授权不是永久授权。
本轮工程整理仅在本地修改，等待审核，不推送、不合并、不部署。
CV 保持关闭；源文件与生成网页都必须经过隐私审阅。

## 日常流程

1. 检查工作区，在本地 topic 分支修改，保留已有工作。
2. 执行 README 的验证命令；按 VALIDATION.md 检查预览。审查所有拟提交文件，包括草稿和附件。
3. 得到授权后推送并创建 PR，说明实际改动、事实来源、验证结果和剩余问题。
4. 检查通过且用户授权合并后，合并已审阅的提交。合并不代表授权部署。
5. 用户要求发布当前版本后，确认 main 指向审核过的合并提交，再执行手动发布。

验证工作流仅响应 main push 和目标为 main 的 PR；取消同一 PR/ref 的过期验证。
它没有 Pages 写权限，也没有部署步骤。开发分支 push 不重复运行验证。

## 手动部署

在 GitHub Actions 打开 **Publish site (manual approval)**：选择 main，输入精确的 `PUBLISH`。
工作流必须重新通过 `ruby scripts/check_content.rb --release`、生产构建和生成站点检查，
再部署同一构建产物。输入不匹配或来源不是 main 时不能发布。

保留既有 permissions、github-pages environment 和审批边界。不要为绕过失败或审批修改规则。
分支保护和 environment required reviewers 的实际配置需单独核实，不能假定已启用，也不在本轮更改。

发布后核实部署成功、首页与手机布局、项目页、当前文章/列表、RSS、sitemap 和 404。
本轮删除文章后，旧 URL 预计返回 404；若用户希望保留入口，先确定替代内容或重定向目标。
回滚同样需要授权，使用可审阅的回滚提交，不改写历史。

## 草稿与产物

`_drafts/` 的源文件仍公开；私人内容放 ignored/excluded 的 `private-drafts/` 或仓库外。
不得上传草稿预览、`work/` 中的测试站点或其他本地截图。部署仅使用正式生产 `_site/`。
技术栈和依赖安装见 README；不添加 `.nojekyll` 或自定义 Jekyll 插件。
